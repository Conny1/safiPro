const cron = require("node-cron");
const { Payment, User } = require("../models");
const { ObjectId } = require("mongodb");

const checkSubscription = cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Running daily task...");
    let currentDate = new Date();
    const expiredPayments = await Payment.aggregate([
      {
        $match: {
          expires_at: { $lt: currentDate },
          status: "active",
        },
      },
    ]);
    if (expiredPayments && expiredPayments.length !== 0) {
      await Promise.all(
        expiredPayments.map(async (item) => {
          let user_id = item.user_id;
          if (user_id) {
            return Promise.all([
              User.findByIdAndUpdate(new ObjectId(user_id), {
                $set: { subscription: "inactive" },
              }),
              User.updateMany(
                { super_admin_id: new ObjectId(user_id) },
                { $set: { subscription: "inactive" } }
              ),
              Payment.findOneAndUpdate(
                { user_id: new ObjectId(user_id) },
                {
                  $set: { status: "expired" },
                }
              ),
            ]);
          }
          return null;
        })
      );
    }
  },
  { scheduled: false }
);

const startAllCrons = () => {
  checkSubscription.start();
};

module.exports = {
  startAllCrons,
};
