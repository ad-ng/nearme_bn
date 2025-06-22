export const optTemplate = (
  firstName: string,
  lastName: string,
  verificationCode,
) => {
  return `<!--
* This email was built using Tabular.
* For more information, visit https://tabular.email
-->
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 30px;
      color: #333333;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #222222;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin: 0 0 20px;
    }
    .otp-code {
      display: inline-block;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      background-color: #f0f0f0;
      padding: 12px 24px;
      border-radius: 6px;
      color: #111111;
      user-select: all;
    }
    .footer {
      font-size: 12px;
      color: #999999;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>${firstName} ${lastName},</h1>
    <p>Your OTP code is:</p>
    <div class="otp-code">${verificationCode}</div>
    <p>Please use this code to complete your verification. This code is valid for a limited time and should not be shared with anyone.</p>
    <p>Thank you,<br />The Verification Team</p>
    <div class="footer">If you did not request this code, please ignore this email.</div>
  </div>
</body>
</html>
`;
};
