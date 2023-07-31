// Create the volume control element
let volumeControl = document.createElement('div');
// Add classes to the volume control element for styling
volumeControl.classList.add('bc-col-responsive', 'adblCloudPlayerVolumeControl', 'bc-text-center', 'bc-col-3')

// Add the button
let button = document.createElement('button');
// Add classes to the button for styling
button.classList.add('changeVolume');
button.type = 'button';
button.onclick = function() {
    // Toggle the display of the slider container when the button is clicked
    sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'flex' : 'none';
}

// Add the icon
let currentVolume = document.createElement('span');
// Add classes to the icon for styling
currentVolume.classList.add('bc-text', 'currentVolume', 'bc-size-large', 'bc-color-secondary')
currentVolume.textContent = "100%"
button.appendChild(currentVolume);

// Add a line break
button.appendChild(document.createElement('br'))

// Add the text
let text = document.createElement('span');
// Add classes to the text for styling
text.classList.add('bc-text', 'bc-size-mini', 'bc-color-secondary');


const userLang = navigator.language || navigator.userLanguage; 

const volumeNames = ['Lautstärke', 'Volume']
let volumeName;

switch (userLang) {
    case 'de':
        volumeName = volumeNames[0]
        break;
    case 'en':
        volumeName = volumeNames[1]
        break;
    case 'fr':
        volumeName = volumeNames[1]
        break;
    default:
        volumeName = volumeNames[1]
        break;
}

text.textContent = volumeName;



button.appendChild(text);

// Add the button to the trigger
let trigger = document.createElement('div');
// Add classes to the trigger for styling
trigger.classList.add('bc-trigger');
trigger.appendChild(button);
volumeControl.appendChild(trigger);

// Create the slider container
let sliderContainer = document.createElement('div');
sliderContainer.style.display = 'none';
sliderContainer.style.flexDirection = 'column';
sliderContainer.style.alignItems = 'center';
sliderContainer.style.transform = 'rotate(-90deg) translateX(120%) translateY(-25%)';
sliderContainer.style.width = '100px'
sliderContainer.style.height= '40px'
sliderContainer.style.cursor = 'pointer';
volumeControl.appendChild(sliderContainer);

// Create css for changing the thumb of the range
var style = document.createElement('style');
style.textContent = `
  .volume-range[type=range]::-moz-range-thumb {
    background: #f7991c;
    box-shadow:-1px 0 2px 0 rgba(0,0,0,.5);
    border:0 solid 0;
    border-radius:9px;
    border-color: #f7991c;
    cursor:pointer;
    height:9px;
    width:9px;
    -webkit-appearance:none;
  }

  .volume-range[type=range]::-ms-thumb {
    background: #f7991c;
    box-shadow:-1px 0 2px 0 rgba(0,0,0,.5);
    border:0 solid 0;
    border-radius:9px;
    border-color: #f7991c;
    cursor:pointer;
    height:9px;
    width:9px;
    -webkit-appearance:none;
  }
`;
document.head.appendChild(style);

// Add the slider
let slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 100;
slider.value = document.getElementsByTagName("audio")[0].volume * 100;
slider.style.margin = 'auto';
slider.style.width = '100px'
slider.style.cursor = 'pointer'

//Add the class for changing thumb
slider.classList.add('volume-range')

// Change Color of slider
slider.style.backgroundColor = '#f7991c';

// For WebKit-Based Browser
slider.style.webkitAppearance = 'none';

// For Firefox
slider.style.mozAppearance = 'none';

// Add Shadow to slider
slider.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 3px';

slider.style.height = '2px';
slider.oninput = function() {
    // Update the volume of the audio element when the slider is moved
    document.getElementsByTagName("audio")[0].volume = this.value / 100;
    currentVolume.textContent = this.value + '%';

    // Save the current volume in a cookie
    document.cookie = `volume=${this.value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}
sliderContainer.appendChild(slider);

// Load the saved volume from the cookie
let cookies = document.cookie.split('; ');
let volumeCookie = cookies.find(cookie => cookie.startsWith('volume='));
if (volumeCookie) {
    let volumeValue = volumeCookie.split('=')[1];
    slider.value = volumeValue;
    currentVolume.textContent = volumeValue + '%';
    // Update the volume of the audio element with the saved value from the cookie
    document.getElementsByTagName("audio")[0].volume = volumeValue / 100;
}

// Add the volume control to the page
let menuArea = document.getElementById('adbl-cloud-player-bottom-menu-area');
menuArea.appendChild(volumeControl);

// Change the name of playback speed
let index = 0
const searchTexts = ['Abspielgeschwindigkeit', 'Narration Speed', 'Vitesse de narration'];
let spans = document.querySelectorAll('span');
let span;
for (let i = 0; i < spans.length; i++) {
    searchTexts.forEach((word, j) => {
        if (spans[i].textContent === word) {
            span = spans[i];
            index = j;
        }
    });
    if(index !== 0) break;
}

const speedNames = ['Geschwindigkeit', 'Speed', 'Vitesse']

if(span != undefined) span.textContent = speedNames[index]

// Change column spacing
let elements = menuArea.children;
for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    // Removed the col class
    element.classList.remove('bc-col-4')

    // Add it to a smaller scale to fit in volume control
    element.classList.add('bc-col-3')
}


function updateSliderValue(event) {
    event.stopPropagation();

    // Get the position of the click or touch relative to the slider
    let rect = slider.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Adjust the position to account for the transformation
    let adjustedX = y;
    let adjustedY = slider.offsetWidth - x;

    // Calculate the new value of the slider based on the adjusted position of the click or touch
    let newValue = (adjustedX / slider.offsetWidth) * (slider.max - slider.min) + parseInt(slider.min);

    // Convert to volume
    newValue = 100 - newValue

    // Update the value of the slider
    slider.value = newValue;

    // Trigger the input event on the slider to update the volume
    var inputEvent = new Event('input');
    slider.dispatchEvent(inputEvent);
}


// Add event listeners to the slider container for mousedown and touchstart events
sliderContainer.addEventListener('touchstart', updateSliderValue);

// Add a flag to track whether the mouse button is pressed
let isMouseDown = false;

// Add an event listener to the document for Mousemove events
document.addEventListener('mousemove', function(event) {
    // Prevent the event from being propagated
    event.stopPropagation();

    // Update the slider only if the mouse button is pressed
    if (isMouseDown) {
        updateSliderValue(event);
    }
});

// Add an event listener to the document for Mouseup events
document.addEventListener('mouseup', function(event) {
    // Prevent the event from being propagated
    event.stopPropagation();

    // Set the isMouseDown flag to false when the mouse button is released
    isMouseDown = false;
});

// Update the event listener on the slider container to set the isMouseDown flag to true when the mouse button is pressed
sliderContainer.addEventListener('mousedown', function(event) {
    // Prevent the event from being propagated
    event.stopPropagation();

    isMouseDown = true;
    updateSliderValue(event);
});