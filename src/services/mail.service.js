import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();
class MailService {
    constructor(){
        this.log = logger;
        const transportParams = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        };
      //  console.log(transportParams);
        this.transporter = nodemailer.createTransport(transportParams);
      
    }
async sendActMail(to, actLink) {
//    this.log.info(`>>> mail serv req`);
//    this.log.info(`>>> to ${to} actlink ${actLink}`);

    let params = {
        from: process.env.SMTP_USER,
        to,
        subject: "acc activation",
        text: "",
        html: 
            `
            <div>
                <h1>Click for activate your acc</h1>
                <a href="${actLink}">${actLink}</a>
            </div>
            `
    };
    //console.log(params);
    try {
        await this.transporter.sendMail(params);
    } catch (e) {
        console.log("--- mail error ---->")
        console.log(e);
    }
    
}




    

}
const mailService = new MailService(logger);
export default mailService;