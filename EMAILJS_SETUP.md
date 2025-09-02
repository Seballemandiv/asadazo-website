# Email Setup Guide

This guide provides simple options to set up email functionality for your contact forms to send emails to `allemandi.Sebastian@expandam.nl`.

## Option 1: Formspree (Recommended - Easiest)

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint (e.g., `https://formspree.io/f/your_form_id`)
5. Update the Contact component:

```typescript
// In src/components/Contact.tsx, replace the form tag with:
<form 
  action="https://formspree.io/f/your_form_id" 
  method="POST" 
  className="contact-form"
>
  {/* Add a hidden field for the recipient */}
  <input type="hidden" name="_replyto" value="allemandi.Sebastian@expandam.nl" />
  {/* Rest of your form fields */}
</form>
```

6. Update the OnRequest component similarly
7. Test the forms - emails will be sent to your Formspree dashboard and forwarded to the recipient

## Option 2: Netlify Forms (If using Netlify)

1. Deploy your site to Netlify
2. Add `data-netlify="true"` to your forms
3. Add a hidden input: `<input type="hidden" name="bot-field" />`
4. Netlify will automatically handle form submissions
5. Configure email notifications in your Netlify dashboard

## Option 3: Custom Backend API

1. Create a simple backend API (Node.js, Python, PHP, etc.)
2. Set up email sending using libraries like Nodemailer, SendGrid, or SMTP
3. Update the form submission handlers to call your API
4. Handle email sending on the backend

## Option 4: Email Service Integration

1. **SendGrid**: Sign up and use their API
2. **Mailgun**: Set up a domain and use their API
3. **AWS SES**: Use Amazon's email service
4. **Gmail API**: Use Google's email service

## Current Implementation

The forms currently simulate successful submissions. To enable real email functionality, choose one of the options above and update the components accordingly.

## Testing

1. Start your development server: `npm run dev`
2. Go to the Contact page and submit a test message
3. Go to the On Request page and submit a test request
4. Check if emails are being sent to `allemandi.Sebastian@expandam.nl`

## Security Notes

- Never expose API keys in frontend code
- Use environment variables for sensitive information
- Consider implementing rate limiting
- Add CAPTCHA for spam prevention in production

## Recommendation

For a quick setup, use **Formspree** (Option 1). It's free for up to 50 submissions per month and requires no backend setup.
