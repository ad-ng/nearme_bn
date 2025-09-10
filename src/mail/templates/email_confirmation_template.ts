export const sendEmailConfirmationCode = (
  otp: string,
  firstName: string,
  lastName: string,
) => {
  return `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Confirmation</title>
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
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      padding: 30px;
      color: #333333;
    }
    h1 {
      color: #2a9d8f;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      color: #e76f51;
      background-color: #fce8e6;
      padding: 15px 25px;
      border-radius: 6px;
      display: inline-block;
      letter-spacing: 4px;
      user-select: all;
    }
    .footer {
      font-size: 12px;
      color: #999999;
      margin-top: 40px;
      text-align: center;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        margin: 20px;
        padding: 20px;
      }
      h1 {
        font-size: 20px;
      }
      .otp-code {
        font-size: 24px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container" role="main">
    <h1>Hello ${firstName} ${lastName},</h1>
    <p>Your OTP code is below. Please use this code to complete your verification process. This code is valid for a limited time only.</p>
    <div class="otp-code" aria-label="One Time Password">${otp}</div>
    <p>If you did not request this code, please ignore this email or contact support if you have concerns.</p>
    <div class="footer">
      &copy; <span id="currentYear"></span> NearMe. All rights reserved.
    </div>
  </div>
  <script>
    document.getElementById('currentYear').textContent = new Date().getFullYear();
  </script>
</body>
</html>
`;
};
