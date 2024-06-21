import { Router } from "express";
import AppointmentsODM from "../appointmentsODM";
import IAppointment from "../Interfaces/IAppointment";

const routerAppointments = Router();
const appointmentsODM = new AppointmentsODM();

const testDoctorID = "000-000-000-00";

type postRequestBody = {
  date: string;
  _client_id: string;
}

routerAppointments.post("/appointments", async (req, res) => {
	const {date: dateString, _client_id}: postRequestBody = req.body;

	if(!dateString){
		res.status(400).json("A valid appointment date is required");
	}

	if(!_client_id){
		res.status(400).json("Client ID required");
	}

	const appointmentData: IAppointment = {
		date: new Date(dateString),
		_client_id: _client_id,
	};

	try{
		const doctorDocument =  await appointmentsODM.getDoctorDocument(testDoctorID);
		
		if(doctorDocument){
			await appointmentsODM.updateCollection(doctorDocument, appointmentData);
		} else {
			await appointmentsODM.createCollection(appointmentData, testDoctorID);
		}

	
		res.status(200).json("Appointment added successfully");
	} catch(err){
		const errObject = err as Error;
		res.status(400).json(errObject.message);
	}
});

routerAppointments.delete("/appointments/:id", async (req, res) => {
	const id = req.params.id as string;
	
	if(id.length != 24){
		return res.status(400).json("Invalid Appointment ID");
	}

	if(!id){
		return res.status(400).json("Appointment ID required");
	}

	try{
		await appointmentsODM.deleteOne(testDoctorID, id);
	
		res.status(200).json("Appointment removed successfully");
	} catch(err){
		const errObject = err as Error;
		res.status(400).json(errObject.message);
	}
});

export default routerAppointments;