import express from "express";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";


const app = express();

dotenv.config(); 
app.use(express.json());


const Mongo_URL = process.env.Mongo_URL;
const PORT = process.env.PORT || 4000;
// console.log(process.env.Mongo_URL);

async function createConnection(){
    const client = new MongoClient(Mongo_URL);
    await client.connect();
    console.log("MongoDB is Connected");
    return client;
}

const client = await createConnection();

app.get("/", function(req,res){
    res.send("Hi");
});

app.get("/rooms", async function(req,res){
    const rooms = await client.db("hallBooking").collection("rooms").find().toArray();
    res.send(rooms);
});


//Query-01 : Creating a room with 1) Number of seats available, 2) Aminities in Room, 3) Price for 1 hour
app.post("/rooms/create",async function(req,res){
    const data = req.body;
    const roomsWithRequestedID = await client.db("hallBooking").collection("rooms").find({"Room_Id" : data[0].Room_Id}).toArray();
    console.log(roomsWithRequestedID, roomsWithRequestedID.length);
    console.log(data);
    try{
        if(!roomsWithRequestedID.length){
            const result = await client.db("hallBooking").collection("rooms").insertMany(data);
            res.send(result);
            console.log(result);
        }else{
            res.status(404).send({"message":`Room ID ${data[0].Room_Id} already exists`})
        }
    }catch(err){
        // console.log(err);
        res.send(err.message);
    }
});


//Query-02 : Booking a room with 1) Customer Name, 2) Date, 3) Start Time, 4) End Time, 5) Room ID
app.post("/rooms/bookRoom",async function(req,res){
    const data = req.body;
    console.log("data", data);
    const requestedDate = data[0].Date;
    const requestedStartTime = data[0].Start_Time;
    const requestedEndTime = data[0].End_Time;

    const bookedDateData = await client.db("hallBooking").collection("rooms").find().toArray();
    
    let isBooked = false;
    let room_number=0;
    
    var roomId;
    for(var i=0; i<bookedDateData.length; i++) {
        isBooked = false;
        for(var j=0; j<bookedDateData[i].Booking_Details.length; j++) {
            let value1 = bookedDateData[i].Booking_Details[j];
            if(value1.Date != requestedDate){
                isBooked = false;
            }else if(value1.Date === requestedDate){
                if((requestedStartTime >= value1.Start_Time && requestedStartTime <= value1.End_Time)||(requestedEndTime >= value1.Start_Time && requestedEndTime <= value1.End_Time)) {
                    isBooked= true;
                    break;
                }
            }
        }
        if(!isBooked) {
            roomId = bookedDateData[i].Room_Id;
            var index = i;
            break;
        }
    }
    
    if(isBooked){
        res.send({"message":"No rooms available for selected date and time"});
    }else{
        const result = await client.db("hallBooking").collection("rooms").updateOne({Room_Id: roomId}, {$push: {Booking_Details: data[0]}});
        res.send(result);
    }

    
});



//Query-03 : List all rooms with booked data with 1) Room Name, 2) Booked Status, 3) Customer Name, 4) Date, 5) Start Time, 6) End Time
app.get("/rooms/getBookedDetails",async function(req,res){
    var roomDetails = [];
    const bookedData = await client.db("hallBooking").collection("rooms").find().toArray();
    for(var i=0; i<bookedData.length; i++) {
        roomDetails[i]={};
        roomDetails[i].Room_Id = bookedData[i].Room_Id;
        roomDetails[i].Booking_Details = bookedData[i].Booking_Details;
    }
    res.send(roomDetails);
})



//Query-04 : List all customers with booked data with 1) Room Name, 2) Booked Status, 3) Customer Name, 4) Date, 5) Start Time, 6) End Time
app.get("/rooms/getBookedCustomerDetails",async function(req,res){
    var customerDetails = [];
    // var roomDetails = [];
    const bookedData = await client.db("hallBooking").collection("rooms").find().toArray();
    var roomNum={};
    for(var i=0; i<bookedData.length; i++) {
        roomNum.Room_Id = bookedData[i].Room_Id;
        for(var j=0; j<bookedData[i].Booking_Details.length; j++){
            var roomDetails = {...roomNum,...bookedData[i].Booking_Details[j]};
            customerDetails.push(roomDetails);
        } 
    }
    res.send(customerDetails);
})



app.listen(PORT, ()=>console.log(`App has started in ${PORT}`));