import Stripe from 'stripe';
import dotenv from "dotenv";
import Bin from '../models/bin.model.js';

dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createSession = async (req, res) => {
  const { userId, userName, userEmail, totalPrice, binLevels, longitude, latitude, address, overallPercentage } = req.body;

  console.log("Data to be passed to metadata:", {
      userId,
      userName,
      userEmail,
      binLevels,
      longitude,
      latitude,
      address,
      overallPercentage,
      totalPrice
  });

  try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
              userId,
              userEmail,
              userName,
              binLevels: JSON.stringify(binLevels),  // Ensure binLevels is a string
              longitude,
              latitude,
              address,
              overallPercentage,
              totalPrice
          }
      });

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer: customer.id,
          line_items: [{
              price_data: {
                  currency: 'lkr',
                  product_data: {
                      name: `Waste Collection for ${userName}`,
                  },
                  unit_amount: Math.round(totalPrice * 100),
              },
              quantity: 1,
          }],
          mode: 'payment',
          success_url: 'http://localhost:5173/request-success',
          cancel_url: 'http://localhost:5173/order-summary',
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating Stripe session:', error.message);
      res.status(500).json({ error: error.message });
  }
};


export const createOrUpdateBin = async (customer, session) => {
  try {
      // Metadata is in the customer object, not session
      const { userId, userName, userEmail, binLevels, longitude, latitude, address, overallPercentage,totalPrice } = customer.metadata;

      console.log("Metadata retrieved from customer:", {
          userId,
          userName,
          userEmail,
          binLevels,
          longitude,
          latitude,
          address,
          overallPercentage,
          totalPrice
      });

      // Parse binLevels as it was stored as a JSON string
      const parsedBinLevels = JSON.parse(binLevels);

      let bin = await Bin.findOne({ userId });

      if (bin) {
          // Update bin if it exists
          bin.longitude = longitude;
          bin.userEmail = userEmail;
          bin.latitude = latitude;
          bin.address = address;
          bin.binLevels = parsedBinLevels; 
          bin.totalPrice = totalPrice;
          bin.overallPercentage = overallPercentage;
          bin.isRequested = true;
      } else {
          // Create a new bin if it does not exist
          bin = new Bin({
              userId,
              userName,
              userEmail,
              longitude,
              latitude,
              address,
              binLevels: parsedBinLevels,
              overallPercentage,
              totalPrice,
              isRequested: true,
          });
      }

      await bin.save();
      console.log('Bin created or updated successfully');
  } catch (error) {
      console.error('Error creating or updating bin:', error);
  }
};


let endpointSecret;

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified!!");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createOrUpdateBin(customer, data);
        console.log("Order created successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};
