import * as React from "react";
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import moment from "moment";
import DatePicker from "material-ui/DatePicker";
import Dialog from "material-ui/Dialog";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import SnackBar from "material-ui/Snackbar";
import Card from "material-ui/Card";
//import { Step, Stepper, StepLabel, StepContent } from "material-ui/Stepper";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import Toolbar from "@mui/material/Toolbar";
//import Typography from "@mui/material/Typography";
//import Button from "@mui/material/Button";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Payment from "./Payment";

const style = {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const API_BASE = "https://still-hollows-91311.herokuapp.com/";

export default function Appointment() {
    const [open, setOpen] = React.useState(false);
    const [stepIndex, setStepIndex] = React.useState(0);
    const [finished, setFinished] = React.useState(false);
    const [smallScreen, setSmallScreen] = React.useState(
        window.innerWidth < 768
    );
    const [schedule, setSchecule] = React.useState([]);
    const [data, setData] = React.useState({
        validEmail: true,
        validPhone: true,
    });
    const [appointmentMeridiem, setAppointmentMeridiem] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [appointmentSlot, setAppointmentSlot] = React.useState("");
    const [appointmentDate, setAppointmentDate] = React.useState();
    const [confirmationModalOpen, setConfirmationModalOpen] =
        React.useState(false);

    const [processedVal, setProcessedVal] = React.useState({});

    const [treatmentType, setTreatmentType] = React.useState(0);

    const handleModalOpen = () => setOpen(!open);
    const handleClose = () => setOpen(!open);

    const DatePickerExampleSimple = () => (
        <DatePicker
            hintText="Select Date"
            mode={smallScreen ? "portrait" : "landscape"}
            onChange={(n, date) => handleSetAppointmentDate(date)}
            shouldDisableDate={(day) => checkDisableDate(day)}
        />
    );
    const handleNext = () => {
        setStepIndex(stepIndex + 1);
        setFinished(stepIndex >= 3);
        setOpen(stepIndex >= 3 ? false : true);
    };
    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };
    const handleSetAppointmentDate = (date) => setAppointmentDate(date);

    const checkDisableDate = (day) => {
        const dateString = moment(day).format("YYYY-DD-MM");
        return (
            schedule[dateString] === true ||
            moment(day).startOf("day").diff(moment().startOf("day")) < 0
        );
    };
    const renderStepActions = (step) => {
        return (
            <div style={{ margin: "12px 0" }}>
                {step < 3 && (
                    <RaisedButton
                        label="Next"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        primary={true}
                        onClick={handleNext}
                        backgroundColor="#00C853 !important"
                        style={{ marginRight: 12, backgroundColor: "#00C853" }}
                    />
                )}

                {step === 3 && (
                    <RaisedButton
                        label="Cancel"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        primary={true}
                        onClick={handelCancel}
                        backgroundColor="#00C853 !important"
                        style={{ marginRight: 12, backgroundColor: "#00C853" }}
                    />
                )}

                {step > 0 && (
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={handlePrev}
                    />
                )}
            </div>
        );
    };

    const handleSetAppointmentMeridiem = (meridiem) =>
        setAppointmentMeridiem(meridiem);

    const handleSetTreatment = (val) => setTreatmentType(val);

    const renderAppointmentTimes = () => {
        if (!isLoading) {
            let x = {
                slotInterval: 30,
                openTime: "9:00",
                closeTime: "19:00",
            };
            //Format the time
            let startTime = moment(x.openTime, "HH:mm");

            //Format the end time and the next day to it
            let endTime = moment(x.closeTime, "HH:mm");

            //Times
            let allTimes = [];

            //Loop over the times - only pushes time with 30 minutes interval
            while (startTime < endTime) {
                //Push times
                allTimes.push(startTime.format("HH:mm a"));
                //Add interval of 30 minutes
                startTime.add(x.slotInterval, "minutes");
            }
            return allTimes.map((slot) => {
                const appointmentDateString =
                    moment(appointmentDate).format("YYYY-DD-MM");
                const meridiemDisabled = appointmentMeridiem
                    ? slot.split(" ")[1] === "am"
                    : slot.split(" ")[1] === "pm";
                const scheduleDisabled = schedule[appointmentDateString]
                    ? schedule[moment(appointmentDate).format("YYYY-DD-MM")][
                          slot
                      ]
                    : false;
                return (
                    <RadioButton
                        label={slot}
                        key={slot}
                        value={slot}
                        style={{
                            marginBottom: 15,
                            display: meridiemDisabled ? "none" : "inherit",
                        }}
                        disabled={scheduleDisabled || meridiemDisabled}
                    />
                );
            });
        } else {
            return null;
        }
    };

    const handleSetAppointmentSlot = (slot) => setAppointmentSlot(slot);

    const validateEmail = (email) => {
        const regex =
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return regex.test(email)
            ? setData({ ...data, email: email, validEmail: true })
            : setData({ ...data, validEmail: false });
    };
    const validatePhone = (phoneNumber) => {
        const regex =/^[0-9]{8}$/;
        return regex.test(phoneNumber)
            ? setData({ ...data, phone: phoneNumber, validPhone: true })
            : setData({ ...data, validPhone: false });
    };

    const contactFormFilled =
        data.name &&
        data.phone &&
        data.email &&
        data.validPhone &&
        data.validEmail &&
        data.nric;

    const renderAppointmentConfirmation = () => {
        const spanStyle = { color: "#00C853" };
        return (
            <section>
                <p>
                    Name: <span style={spanStyle}>{data.name}</span>
                </p>
                <p>
                    Number: <span style={spanStyle}>{data.phone}</span>
                </p>
                <p>
                    Email: <span style={spanStyle}>{data.email}</span>
                </p>
                <p>
                    Appointment:{" "}
                    <span style={spanStyle}>
                        {moment(appointmentDate).format(
                            "dddd[,] MMMM Do[,] YYYY"
                        )}
                    </span>{" "}
                    at <span style={spanStyle}>{appointmentSlot}</span>
                </p>
                <Typography variant="body2" gutterBottom>
                Appointments require a <b>SGD 50 deposit</b>. This will be deducted from the bill on departure. This is transferable if <b>24 hours</b> notice of cancellation or amendment is given.
      </Typography>
            </section>
        );
    };

    const handleSubmit = () => {
        const value = {
            ...data,
            appointmentSlot,
            appointmentDate,
            treatmentType
        };
        setConfirmationModalOpen(false);
        setOpen(false);
        axios
            .post(API_BASE + "appointments", value)
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                setStepIndex(0);
                setData({});
                setAppointmentDate("");
                setAppointmentSlot("");
                window.location.href = "https://buy.stripe.com/test_14k8zzeII9n6as0000";
            })
            .catch((err) => {
                setProcessedVal({
                    confirmationSnackbarMessage: "Appointment failed to save.",
                    confirmationSnackbarOpen: true,
                    processed: true,
                });
            });
    };
    const handelCancel = () => {
        setStepIndex(0);
                setData({});
                setAppointmentDate("");
                setAppointmentSlot("");
                setOpen(false)
    }
    const modalActions = [
        <FlatButton
            label="Cancel"
            primary={false}
            onClick={() => setConfirmationModalOpen(false)}
        />,
        <FlatButton
            label="Confirm"
            style={{ backgroundColor: "#00C853 !important" }}
            primary={true}
            onClick={handleSubmit}
        />,
    ];
    return (
        <>
            <AppBar
                title="ADEVA"
                className="no-bg"
                position="static"
                showMenuIconButton={false}
            >
                <Toolbar>
                
                <Button
                        variant="outlined"
                        style={{ color: "#FFF" }}
                        color="inherit"
                        onClick={handleModalOpen}
                    >
                        Book Now
                    </Button>
                </Toolbar>
            </AppBar>
            <div
                style={{
                    display: open ? "none" : "block",
                    maxWidth: !smallScreen ? "80%" : "100%",
                    margin: "auto",
                    //marginTop: !smallScreen ? 40 : 0,
                    marginTop: "20%",
                    marginBottom: 20,
                    color: "#FFF",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div"
                    align="center"
                >
                    Rejuvenate and relax your body and mind with our Signature
                    Spa treatments and therapies
                </Typography>
            </div>
            <Card
                style={{
                    padding: "25px 12px 25px 12px",
                    height: smallScreen ? "100vh" : null,
                    maxWidth: !smallScreen ? "80%" : "100%",
                    margin: "auto",
                    marginTop: !smallScreen ? 40 : 0,
                    marginBottom: 20,
                    display: open ? "block" : "none",
                }}
            >
                <Box>
                    <Stepper
                        activeStep={stepIndex}
                        orientation="vertical"
                        linear={false}
                    >
                        <Step>
                            <StepLabel>Choose treatment type</StepLabel>
                            <StepContent>
                                <SelectField
                                    floatingLabelText="Facial/Body"
                                    value={treatmentType}
                                    onChange={(evt, key, payload) =>
                                        handleSetTreatment(payload)
                                    }
                                    selectionRenderer={(value) =>
                                        value ? "Body" : "Facial"
                                    }
                                >
                                    <MenuItem value={0} primaryText="Facial" />
                                    <MenuItem value={1} primaryText="Body" />
                                </SelectField>
                                {renderStepActions(0)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>
                                Choose an available day for your appointment
                            </StepLabel>
                            <StepContent>
                                {DatePickerExampleSimple()}
                                {renderStepActions(1)}
                            </StepContent>
                        </Step>
                        <Step disabled={!appointmentDate}>
                            <StepLabel>
                                Choose an available time for your appointment
                            </StepLabel>
                            <StepContent>
                                <SelectField
                                    floatingLabelText="AM/PM"
                                    value={appointmentMeridiem}
                                    onChange={(evt, key, payload) =>
                                        handleSetAppointmentMeridiem(payload)
                                    }
                                    selectionRenderer={(value) =>
                                        value ? "PM" : "AM"
                                    }
                                >
                                    <MenuItem value={0} primaryText="AM" />
                                    <MenuItem value={1} primaryText="PM" />
                                </SelectField>
                                <RadioButtonGroup
                                    style={{
                                        marginTop: 15,
                                        marginLeft: 15,
                                    }}
                                    name="appointmentTimes"
                                    defaultSelected={appointmentSlot}
                                    onChange={(evt, val) =>
                                        handleSetAppointmentSlot(val)
                                    }
                                >
                                    {renderAppointmentTimes()}
                                </RadioButtonGroup>
                                {renderStepActions(2)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>
                                Share your contact information with us and we'll
                                send you a reminder
                            </StepLabel>
                            <StepContent>
                                <p>
                                    <section>
                                        <TextField
                                            style={{ display: "block" }}
                                            name="name"
                                            hintText="First Name"
                                            floatingLabelText="Name"
                                            onChange={(evt, newValue) =>
                                                setData({
                                                    ...data,
                                                    name: newValue,
                                                })
                                            }
                                        />
                                        <TextField
                                            style={{ display: "block" }}
                                            name="email"
                                            hintText="youraddress@mail.com"
                                            floatingLabelText="Email"
                                            errorText={
                                                data.validEmail
                                                    ? null
                                                    : "Enter a valid email address"
                                            }
                                            onChange={(evt, newValue) =>
                                                validateEmail(newValue)
                                            }
                                        />
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "rgba(0, 0, 0, 0.6)",
                                            }}
                                        >
                                             So we can send you a confirmation as well as a receipt
                                        </span>
                                        <TextField
                                            style={{ display: "block" }}
                                            name="phone"
                                            hintText="6548995989"
                                            floatingLabelText="Phone"
                                            errorText={
                                                data.validPhone
                                                    ? null
                                                    : "Enter a valid phone number"
                                            }
                                            onChange={(evt, newValue) =>
                                                validatePhone(newValue)
                                            }
                                        />
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "rgba(0, 0, 0, 0.6)",
                                            }}
                                        >
                                            Just in case we need to give you a call.  Also, we'll send you a text message reminder. 
                                        </span>
                                        <TextField
                                            style={{ display: "block" }}
                                            name="nric"
                                            hintText="2482"
                                            floatingLabelText="Last 4 digits of NRIC "
                                            onChange={(evt, newValue) =>
                                                setData({
                                                    ...data,
                                                    nric: newValue,
                                                })
                                            }
                                        />
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "rgba(0, 0, 0, 0.6)",
                                            }}
                                        >
                                            (In compliance with the massage
                                            compliant act, we require you to
                                            bring together your identification
                                            card)
                                        </span>
                                        <RaisedButton
                                            style={{
                                                display: "block",
                                                backgroundColor: "#00C853",
                                            }}
                                            label={
                                                contactFormFilled
                                                    ? "Schedule"
                                                    : "Fill out your information to schedule"
                                            }
                                            labelPosition="before"
                                            primary={true}
                                            fullWidth={true}
                                            onClick={() =>
                                                setConfirmationModalOpen(
                                                    !confirmationModalOpen
                                                )
                                            }
                                            disabled={
                                                !contactFormFilled ||
                                                data.processed
                                            }
                                            style={{
                                                marginTop: 20,
                                                maxWidth: 100,
                                            }}
                                        />
                                    </section>
                                </p>
                                {renderStepActions(3)}
                            </StepContent>
                        </Step>
                    </Stepper>
                </Box>
            </Card>

            <Dialog
                modal={true}
                open={confirmationModalOpen}
                actions={modalActions}
                title="Confirm your appointment"
            >
                {renderAppointmentConfirmation()}
            </Dialog>
            <SnackBar
                open={processedVal.confirmationSnackbarOpen || isLoading}
                message={
                    isLoading
                        ? "Loading... "
                        : processedVal.confirmationSnackbarMessage || ""
                }
                autoHideDuration={10000}
                onRequestClose={() => setProcessedVal({})}
            />
        </>
    );
}
