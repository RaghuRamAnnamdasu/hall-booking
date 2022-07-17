// Step:01 - Creating a database of name "hallBooking".
use hallBooking;

// step:02 - Creating Collection with name "rooms" and inserting data in to it
db.rooms.insertMany([
    {
        "Room_Id": 100,
        "Seats_Available" : 20,
        "Aminities" : ["Free Wifi","Air Conditioning","Bigger Podium"],
        "Price_per_Hour(INR)" : 500,
        "Booking_Details" : [
            {
                "Customer_Name" : "Raghu",
                "Date" : "2022-07-17",
                "Start_Time" : "12:15:00",
                "End_Time" : "18:30:00"
            },
            {
                "Customer_Name" : "Pravali",
                "Date" : "2022-07-18",
                "Start_Time" : "09:30:00",
                "End_Time" : "12:30:00"
            },
            {
                "Customer_Name" : "Pranavi",
                "Date" : "2022-07-18",
                "Start_Time" : "14:30:00",
                "End_Time" : "18:30:00"
            }
        ]
    },
    {
        "Room_Id": 101,
        "Seats_Available" : 15,
        "Aminities" : ["Free Wifi","Air Conditioning","Medium Podium"],
        "Price_per_Hour(INR)" : 400,
        "Booking_Details" : [
            {
                "Customer_Name" : "Mythri",
                "Date" : "2022-07-25",
                "Start_Time" : "12:15:00",
                "End_Time" : "18:30:00"
            }
        ]
    },
    {
        "Room_Id": 102,
        "Seats_Available" : 18,
        "Aminities" : ["Free Wifi","Air Conditioning","Bigger Podium"],
        "Price_per_Hour(INR)" : 450
    }
])

