// This is the main function Braze runs for every incoming webhook
function transform(event) {
  // Rename the incoming data object from `event` to `payload` for clarity
  var payload = event;

  // --- STEP 1: Identifying the user in Braze using their unique user ID ---
  actions.identifyUser({
    external_id: payload.user_id.toString() 
  });

  // --- STEP 2: Updating user attributes ---
  actions.updateUser({
    external_id: payload.user.user_id.toString(), // same as above
    attributes: {
      first_name: payload.user.first_name, 
      last_name: payload.user.last_name,   
      email: payload.user.email,           
      unsubscribed: payload.user.unsubscribed, 
      user_status: payload.user.user_status,   
      guest_type: payload.user.guest_type,     

      account_balance: {
        current_membership_level_name: payload.user.account_balance.current_membership_level_name,
        loyalty_points: payload.user.account_balance.loyalty_points,         
        total_lifetime_points: payload.user.account_balance.total_lifetime_points 
      }
    }
  });

  // --- STEP 3: Log a custom event in Braze ---
  actions.logCustomEvent({
    external_id: payload.user_id.toString(), 
    name: payload.event_name,                
    properties: {
      business_id: payload.business_id,
      coupon_id: payload.payload.coupon_id,
      coupon_type: payload.payload.coupon_type,
      campaign_name: payload.payload.campaign_name,
      code: payload.payload.code,
      applicable_percentage_discount: payload.payload.applicable_percentage_discount,

      created_at: payload.payload.created_at,
      expiry_at: payload.payload.expiry_at,
      processed_at: payload.payload.processed_at,

      location_id: payload.payload.location_id,

      redeemed_menu_items: payload.payload.redeemed_menu_items.map(function(item) {
        return {
          item_name: item.item_name,
          item_qty: item.item_qty,
          item_amount: item.item_amount
        };
      })
    }
  });

  // Returning the original object as good practice :) 
  return event;
}
