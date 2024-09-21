import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import BackendClient from '../BackendClient';
import { Button } from '@mui/material';
import { worldcoin } from '../urls';

export default function UserVerify() {
    const handleVerify = async (proof) => {
        try {
            const res = await BackendClient.post(`${worldcoin}`, proof, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status !== 200) {
                throw new Error("Verification failed.");
            }

            // Handle successful verification here
        } catch (error) {
            console.error(error.message);
            // Handle error appropriately
        }
    };
    const onSuccess = () => {
        // This is where you should perform any actions after the modal is closed
        // Such as redirecting the user to a new page
        window.location.href = "/home";
    };


    return (
        <div>
            {/* <IDKitWidget></IDKitWidget> */}
            <IDKitWidget
                app_id={process.env.REACT_APP_WORLDCOIN_APP_ID} // obtained from the Developer Portal
                action={process.env.REACT_APP_WORLDCOIN_ACTION} // obtained from the Developer Portal
                onSuccess={onSuccess} // callback when the modal is closed
                handleVerify={handleVerify} // callback when the proof is received
                verification_level={VerificationLevel.Orb}
            >
                {({ open }) =>
                    // This is the button that will open the IDKit modal
                <Button
                variant="contained"
                color="primary"
                onClick={open}
                sx={{
                  color: 'black', 
                  borderRadius: '0%',
                  backgroundColor: 'white',
                  border: '2px solid black',
                  borderRight: '4px solid black', 
                  borderBottom: '4px solid black',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  }
                }}
              >
                Verify with WorldId
              </Button>
                }
            </IDKitWidget>

        </div>
    );
};