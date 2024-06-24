import React from 'react'
import emailjs from 'emailjs-com';
import styles from './ContactStyles.module.css'

function Contact() {
    function sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it

        emailjs.sendForm('service_so8eigq', 'template_i9f602n', e.target, 'QsJri_dJtU5JxAt_Y')
            .then((result) => {
                window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
            }, (error) => {
                console.log(error.text);
            });
    }
    return (
        <section id='contact' className={styles.container}>
            <h1 className='sectionTitle'>Contact</h1>
            <form action="" onSubmit={sendEmail}>
                <div className='formGroup' >
                    <label htmlFor='name' hidden>
                        Name
                    </label>
                    <input type="text" name="name" id="name" placeholder="Enter Name" required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='email' hidden>
                        Email
                    </label>
                    <input type="text" name="email" id="email" placeholder="Enter Email" required />
                </div>
                <div className='formGroup'>
                    <label htmlFor='message' hidden>
                        Message
                    </label>
                    <textarea type="text" name="message" id="message" placeholder="Enter Message" required></textarea>
                </div>
                <input className="hover btn" type="submit" value="Submit" />
            </form>
        </section>
    )
}

export default Contact