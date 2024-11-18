//nav for the screens less than 600px
const bars = document.querySelector('.nav2 i');
const close = document.querySelector('#close');
const navLinks = document.querySelector('.nav_links');

bars.addEventListener('click', () => {
  navLinks.style.display = 'block';
  bars.style.zIndex='-1';
  close.style.zIndex= '1';
  navLinks.classList.add('!active');
});

close.addEventListener('click', () => {
  navLinks.style.display = 'none';
  bars.style.zIndex='1';
  close.style.zIndex= '-1';
  navLinks.classList.remove('active');
});

// form that corrects client details and message
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
  
    let formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
  
  
    // Send the email using EmailJS
    emailjs.send("service_wuxlai7", "template_9zad3tt", formData)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('message sent successfully!');
        }, function(error) {
            console.error('FAILED...', error);
            alert('An error occurred. Please try again.');
        });
  });





//testing function how to create a new instance of the service provider with the given parameters