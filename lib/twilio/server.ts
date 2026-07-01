import twilio from "twilio";

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid) {
    throw new Error("TWILIO_ACCOUNT_SID тохируулаагүй байна.");
  }

  if (apiKeySid && apiKeySecret) {
    return twilio(apiKeySid, apiKeySecret, { accountSid });
  }

  if (authToken) {
    return twilio(accountSid, authToken);
  }

  throw new Error("Twilio API key эсвэл Auth Token тохируулна уу.");
}

export function getVerifyServiceSid() {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!sid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID тохируулаагүй байна.");
  }
  return sid;
}
