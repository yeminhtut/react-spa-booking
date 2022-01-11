import * as React from "react";
import { useNavigate } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "material-ui/AppBar";
import moment from "moment";
import Card from "material-ui/Card";
import axios from "axios";
import { ReactComponent as YourSvg } from "./success.svg";
import Button from "@mui/material/Button";

const API_BASE = "https://still-hollows-91311.herokuapp.com/";

const ConfirmComponent = (props) => {
    const navigate = useNavigate();
    const [smallScreen, setSmallScreen] = React.useState(
        window.innerWidth < 768
    );
    const user = JSON.parse(localStorage.getItem("user"));
    const bookingUser = (user && user.length) > 0 ? user[0] : {};
    React.useEffect(() => {
        if (bookingUser && bookingUser._id) {
            axios
                .post(API_BASE + "send-mail", bookingUser)
                .then((response) => {
                    localStorage.removeItem("user");
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }, []);
    const handleGoBack = () => {
        navigate('/')
    }
    return (
        <>
            <AppBar
                title="ADEVA"
                className="no-bg"
                position="static"
                showMenuIconButton={false}
            ></AppBar>
            {bookingUser && bookingUser._id && (
                <Card
                style={{
                    padding: "25px 12px 25px 12px",
                    height: smallScreen ? "100vh" : null,
                    maxWidth: !smallScreen ? "80%" : "100%",
                    margin: "auto",
                    marginTop: !smallScreen ? 40 : 0,
                    marginBottom: 20,
                    textAlign: "center",
                }}
            >
                <Box>
                    <Typography variant="h4" gutterBottom component="div">
                        CONFIRMATION
                    </Typography>
                    <YourSvg style={{ width: "60px" }} />
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                    >
                        Your appointment is{" "}
                        {moment(bookingUser.slot_date).format("Do, dddd, MMMM")}{" "}
                        {bookingUser.slot_time}.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You'll receive a confirmation email at{" "}
                        <b>{bookingUser.email}</b>.
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="div"
                    >
                        Total: $50
                    </Typography>
                </Box>
                <Button
                                    variant="outlined"
                                    size="large"
                                    color="primary"
                                    onClick={handleGoBack}
                                >
                                    Done
                                </Button>
            </Card>
            )}
            
        </>
    );
};

export default ConfirmComponent;

//export default withRouter(ConfirmComponent)
