export const emailres=()=>
{
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Activated</title>
          <style>
            body { font-family: 'Poppins', sans-serif; text-align: center; padding: 50px; background-color: #f4f4f4; }
            .container { max-width: 450px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
            h1 { color: #2d89ef; font-size: 26px; margin-bottom: 10px; }
            p { color: #555; font-size: 18px; }
            .success-icon { font-size: 50px; color: #2d89ef; margin-bottom: 15px; }
            .button { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2d89ef; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; }
            .button:hover { background: #1a5bbd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✔️</div>
            <h1>Congratulations!</h1>
            <p>Your account has been successfully activated.</p>
            <a href="https://abanoubmamdouhhanna.github.io/taskfe/#/login" class="button">Go to Login</a>
          </div>
        </body>
        </html>
      `
}