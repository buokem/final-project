//array helpers
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysChecker = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

let path = window.location.pathname;
let currentFullDate = new Date();
//for events
let eventData = [];
// Load from localStorage if available

if (path.endsWith("/") || path.endsWith("/index.html")) {

    //get event data
    let storedData = localStorage.getItem('eventData');
    if (storedData) {
        eventData = JSON.parse(storedData);
    }

    //DOM elements
    let currentYearElement = document.querySelector('.current-year');
    let currentMonthElement = document.querySelector('.current-month');
    let calendarBody = document.querySelector('.calendar-dates');
    let prevButton = document.getElementById("previous");
    let nextButton = document.getElementById("next");
    let displayDate = document.querySelector(".current-date");
    let displayDay = document.querySelector(".current-day");
    let eventInput = document.getElementById("event");
    let addEventButton = document.getElementById("add-event-button");
    let eventList = document.querySelector('.current-event-list');

    //date variables
    
    let currentYear = currentFullDate.getFullYear();
    let currentMonth = currentFullDate.getMonth();
    let focusedDate = currentFullDate.getDate();

    //row & col for calendar dates
    let row = 2;
    let col;

    //setting currentYear and currentMonth elements to their appropraite values
    currentYearElement.innerText = currentYear;
    currentMonthElement.innerText = months[currentMonth];

    //functions...

    //get total number of days in a month
    function getDaysInMonth(month, year) {
        let daysInMonth = new Date(year, month, 0).getDate();
        console.log(year, month, daysInMonth);
        return daysInMonth;
    }

    //assigns calendar dates to their grid cells
    function drawCalendarDays() {
        let daysInMonth = getDaysInMonth(currentMonth + 1, currentYear);
        let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        col = firstDayOfMonth + 1;

        for(let i = 0; i < daysInMonth; i++) {
            let calendarDate = document.createElement('div');
            calendarDate.style.gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;
            calendarDate.classList.add('calendar-date');
            calendarDate.innerText = i + 1;
            calendarBody.appendChild(calendarDate);
            if( col + 1 > 7){
                col = 1;
                row++;
            } 
            else{
                col++;
            }
        }
    }

    //navigate calendar using months
    function switchMonth(direction) {
        if(direction === 'next') {
            currentMonth++;
            if(currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        } else if(direction === 'prev') {
            currentMonth--;
            if(currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
        }

        currentYearElement.innerText = currentYear;
        currentMonthElement.innerText = months[currentMonth];
        let totalEl = calendarBody.children;
        Array.from(totalEl).forEach(child => {
            if (!daysChecker.includes(child.innerText)) {
                child.remove();
            }
        });
        row = 2; // Reset row for new month
        col = 1; // Reset column for new month
        drawCalendarDays();
        addEventListenerForDate();
    }

    //give each date an event listener 
    function addEventListenerForDate() {
        setTimeout(()=> {
            let calendarDates = document.querySelectorAll(".calendar-date");
            calendarDates.forEach(cell => {
                cell.addEventListener("click", () => {
                    let pos = cell.style.gridColumn;
                    pos = parseInt(pos[0]);
                    displayDate.innerText = cell.innerText;
                    displayDay.innerText = days[pos - 1];
                    focusedDate = cell.innerText;
                    let events = displayEvent(currentYear, months[currentMonth], focusedDate);
                    displayEventList(eventList, events);
                });
            })
        }, 400);
    }

    function displayEventList(listParent, listEvents) {
        listParent.innerHTML = "";
        listEvents.forEach(item => {
            let li = document.createElement("li");
            li.innerText = item;
            listParent.appendChild(li);
        })
    }

    function addEvent(year, month, date) {
        let eventText = eventInput.value;

        if(eventText) {
            let yearObj = eventData.find(obj => obj.hasOwnProperty(year));

            if (!yearObj) {
                // Year doesn't exist, create whole structure
                let newYearObj = {
                    [year]: {
                        [month]: {
                            [date]: [eventText]
                        }
                    }
                };
                eventData.push(newYearObj);
                
            } else {
                // Year exists
                let monthObj = yearObj[year];

                if (!monthObj.hasOwnProperty(month)) {
                    // Month doesn't exist, create month + date + event
                    monthObj[month] = {
                        [date]: [eventText]
                    };
                } else {
                    // Month exists
                    let dateObj = monthObj[month];

                    if (!dateObj.hasOwnProperty(date)) {
                        // Date doesn't exist, create date + event
                        dateObj[date] = [eventText];
                    } else {
                        // Date exists, just push event
                        dateObj[date].push(eventText);
                    }
                }
            }
            displayEventList(eventList, displayEvent(currentYear, months[currentMonth], focusedDate));
            localStorage.setItem('eventData', JSON.stringify(eventData));
        }
    }

    function displayEvent(year, month, date) {
        let grabYearObj = eventData.find(displayedEvent => displayedEvent.hasOwnProperty(year));

        if (!grabYearObj) {
            return ["Create event now"];
        }

        let grabMonthObj = grabYearObj[year];

        if (!grabMonthObj.hasOwnProperty(month)) {

            return ["Create event now"];;
        }

        let grabDayObj = grabMonthObj[month];

        if (!grabDayObj.hasOwnProperty(date)) {
            return ["Create event now"];;
        }

        let events = grabDayObj[date];
        return events;
    }

        
    //event listeners
    prevButton.addEventListener('click', () => {
        switchMonth('prev');
    });
    nextButton.addEventListener('click', () => {
        switchMonth('next');
    });
    addEventButton.addEventListener('click', () => {
        addEvent(currentYear, months[currentMonth], focusedDate);
        eventInput.value = "";
    });



    drawCalendarDays();
    addEventListenerForDate();
    let events = displayEvent(currentYear, months[currentMonth], focusedDate);
    displayEventList(eventList, events);

    displayDate.innerText = currentFullDate.getDate();
    displayDay.innerText = days[currentFullDate.getDay()];
    console.log("You're on the calendar page!");
}



if (page.includes("summary.html")) {
    // Load event data from localStorage
    const storedData = localStorage.getItem('eventData');
    const eventData = storedData ? JSON.parse(storedData) : [];

    const summaryMonthElement = document.getElementById("summary-month");
    const summaryYearElement = document.getElementById("summary-year");
    const summaryListElement = document.getElementById("monthly-summary-list");

    if (summaryMonthElement && summaryYearElement && summaryListElement) {
        const now = new Date();
        const currentMonthName = months[now.getMonth()];
        const currentYear = now.getFullYear();
        const date = now.getDate();

        summaryMonthElement.innerText = currentMonthName;
        summaryYearElement.innerText = currentYear;

        // Find data for the current year
        const yearObj = eventData.find(obj => obj.hasOwnProperty(currentYear));

        if (!yearObj || !yearObj[currentYear][currentMonthName]) {
            // No events for this month
            summaryListElement.innerHTML = "<li>No monthly goals, click on calendar to add more</li>";
        } else {
            const monthData = yearObj[currentYear][currentMonthName];

            Object.keys(monthData).forEach(day => {
                let intDay = parseInt(day);
                const events = monthData[day];
                const dayItem = document.createElement("li");
                dayItem.innerText = `On ${day} / ${currentMonthName} / ${currentYear}:`;
                dayItem.classList.add("view-events");
                if(intDay > date) {
                    dayItem.classList.add("in-future");
                }
                else if(intDay == date) {
                    dayItem.classList.remove("in-future");
                    dayItem.classList.add("in-progress");
                } 
                else{
                    dayItem.classList.remove("in-progress");
                    dayItem.classList.add("in-past");
                }

                const subList = document.createElement("ul");
                subList.style.marginLeft = "5%";

                events.forEach(event => {
                    const eventItem = document.createElement("li");
                    eventItem.innerText = event;
                    subList.appendChild(eventItem);
                });

                dayItem.appendChild(subList);
                summaryListElement.appendChild(dayItem);
            });
        }
    }
}


//summary js script

