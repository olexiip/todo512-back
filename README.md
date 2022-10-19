# todo512-back
todo back end 
<br>
deployed app with front and back ends u can find here:
<br>
https://todo512-f.herokuapp.com/
<br>
<br>
Project need .env file with foloving data:
<br>
```
MY_PORT=3001   
DB_CON=mongoDB connection string 
JWT_S=pass
JWT_R_S=enother pass        
URL=localhost:3001          
SMTP_HOST=smtp.gmail.com    
SMTP_PORT=587
SMTP_USER=mail
SMTP_PASS=pass
FRONT=localhost:3001        
```
 <br>
 DB_COM - mongo database connection string, i use free database service provided by https://www.mongodb.com/,  
 <br>
 JWT_S - password, for token generation (use for authorithation, check https://jwt.io/ for more info) 
 <br>
 JWT_R_S - password, for refresh-token generation, you should use enother pass for security reason. 
 <br>
SMTP parameters need for sending email to user for registration verification. 
<br>
Im using regular google account, just register new acc, u need check google mail settings, because by default it is disabled, and you should turn off 2fa. Becarefuul google have limits. 
<br>
SMTP_USER = in my case it google email used for sending mails, for ex: some@gmail.com 
<br>
SMTP_PASS = password for this google acc. 
<br>
