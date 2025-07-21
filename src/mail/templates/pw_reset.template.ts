export const pwResetTemplate = (otp: string) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset</title>
  <style>
    /* Basic styling for the email */
    body {
      font-family: sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin: 20px 0;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>You recently requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
    <div class="otp">${otp}</div>
    <p>This OTP is valid for 15 minutes.</p>
    <p>Alternatively, you can click the button below to reset your password:</p>
    <a href="{{reset_link}}" class="button">Reset Password</a>
    <p class="footer">If you did not request a password reset, please ignore this email.</p>
  </div>
</body>
</html>`;
};
