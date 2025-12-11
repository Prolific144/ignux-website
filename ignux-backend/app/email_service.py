# app/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional
import os
from jinja2 import Template
from app.config import settings

class EmailService:
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.email_from = settings.EMAIL_FROM
    
    def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False):
        """Send basic email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_from
            msg['To'] = to_email
            msg['Subject'] = subject
            
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def send_booking_confirmation(self, booking_data: dict):
        """Send booking confirmation email to client"""
        subject = f"IGNUX - Booking Confirmation #{booking_data.get('id', 'NEW')}"
        
        # HTML template for booking confirmation
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF6B00 0%, #FFD700 100%); 
                         color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
                .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎆 IGNUX Booking Confirmation</h1>
                    <p>Your fireworks experience is being prepared!</p>
                </div>
                <div class="content">
                    <p>Dear {{ client_name }},</p>
                    <p>Thank you for booking IGNUX for your {{ event_type }}. Here are your booking details:</p>
                    
                    <div class="booking-details">
                        <h3>📋 Booking Details</h3>
                        <p><strong>Event:</strong> {{ event_name }}</p>
                        <p><strong>Date:</strong> {{ event_date }} at {{ event_time }}</p>
                        <p><strong>Location:</strong> {{ event_location }}</p>
                        <p><strong>Service Package:</strong> {{ service_package }}</p>
                        <p><strong>Duration:</strong> {{ display_duration }}</p>
                        
                        <h3>💰 Payment Information</h3>
                        <p><strong>Total Amount:</strong> KES {{ total_price }}</p>
                        <p><strong>Deposit Due:</strong> KES {{ deposit_amount }}</p>
                        <p><strong>Booking Status:</strong> {{ booking_status }}</p>
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Our team will contact you within 24 hours for site assessment</li>
                        <li>Please confirm the deposit payment to secure your date</li>
                        <li>We'll send you the safety and permit documentation</li>
                    </ol>
                    
                    <p>For any questions, contact us at:</p>
                    <ul>
                        <li>📞 Phone: +254 750 077 424</li>
                        <li>📧 Email: info@ignux.com</li>
                        <li>💬 WhatsApp: https://wa.me/254750077424</li>
                    </ul>
                    
                    <p>Best regards,<br>The IGNUX Team</p>
                </div>
                <div class="footer">
                    <p>IGNUX - Igniting Unforgettable Experiences</p>
                    <p>© {{ current_year }} IGNUX. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_body = template.render(
            client_name=booking_data.get('client_name'),
            event_type=booking_data.get('event_type'),
            event_name=booking_data.get('event_name'),
            event_date=booking_data.get('event_date'),
            event_time=booking_data.get('event_time'),
            event_location=booking_data.get('event_location'),
            service_package=booking_data.get('service_package'),
            display_duration=booking_data.get('display_duration'),
            total_price=booking_data.get('total_price'),
            deposit_amount=booking_data.get('total_price') * 0.3,  # 30% deposit
            booking_status=booking_data.get('booking_status', 'pending'),
            current_year=2024
        )
        
        return self.send_email(booking_data['client_email'], subject, html_body, is_html=True)
    
    def send_contact_confirmation(self, contact_data: dict):
        """Send confirmation email for contact form submission"""
        subject = "IGNUX - Thank You for Contacting Us"
        
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #FF6B00 0%, #FFD700 100%); 
                           color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1>🎆 Thank You for Contacting IGNUX!</h1>
                </div>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
                    <p>Dear {contact_data['name']},</p>
                    <p>We've received your inquiry about our {contact_data['event_type']} services and will get back to you within 24 hours.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <h3>📝 Your Inquiry Summary:</h3>
                        <p><strong>Event Type:</strong> {contact_data['event_type']}</p>
                        <p><strong>Event Date:</strong> {contact_data.get('event_date', 'Not specified')}</p>
                        <p><strong>Budget:</strong> {contact_data.get('budget', 'Not specified')}</p>
                    </div>
                    
                    <p>For immediate assistance, you can:</p>
                    <ul>
                        <li>📞 Call us: +254 750 077 424</li>
                        <li>💬 WhatsApp: <a href="https://wa.me/254750077424">Click to chat</a></li>
                    </ul>
                    
                    <p>Best regards,<br>The IGNUX Team</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>IGNUX - Igniting Unforgettable Experiences</p>
                    <p>© 2024 IGNUX. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(contact_data['email'], subject, html_body, is_html=True)
    
    def send_admin_notification(self, notification_type: str, data: dict):
        """Send notification to admin email"""
        admin_email = settings.EMAIL_FROM
        
        if notification_type == "new_booking":
            subject = f"📋 New Booking - {data.get('event_name')}"
            body = f"""
            New booking received:
            
            Client: {data.get('client_name')}
            Event: {data.get('event_name')} ({data.get('event_type')})
            Date: {data.get('event_date')}
            Amount: KES {data.get('total_price')}
            Phone: {data.get('client_phone')}
            Email: {data.get('client_email')}
            
            Please review in the admin panel.
            """
        
        elif notification_type == "new_contact":
            subject = f"📧 New Contact Form - {data.get('name')}"
            body = f"""
            New contact form submission:
            
            Name: {data.get('name')}
            Email: {data.get('email')}
            Phone: {data.get('phone')}
            Event Type: {data.get('event_type')}
            Message: {data.get('message')[:200]}...
            
            Please respond within 24 hours.
            """
        
        else:
            return False
        
        return self.send_email(admin_email, subject, body)

# Initialize email service
email_service = EmailService()