import {
  Typography,
  Box,
  Button,
  Paper,
  Input,
  TextField,
  Container,
} from "@mui/material";
import BackgroundImageTwo from "../BackgroundImageTwo";
const MintForm = (props) => {
  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Container>
        <Box paddingTop={"10vh"} marginBottom={"5vh"}>
          <Box id="pages" paddingBottom={"10vh"}>
            <div className=" d-flex justify-content-around">
              <div
                style={{
                  backgroundColor: "#212121",
                  marginLeft: "15vw",
                  padding: "15px",
                  borderRadius: "15px",
                  color: "white",
                  marginTop: "10vh",
                }}
                className="col-md-3 "
              >
                <Typography
                  component={"h1"}
                  variant={"h1"}
                  color={"primary"}
                  fontSize={"calc(1.5vw + 1.5vh)"}
                >
                  Fill in the Form to mint a new NFT
                </Typography>
                <Typography component={"h3"} variant={"h3"} color={"white"}>
                  (You must fill out every input field)
                </Typography>
                <div>
                  <Typography component={"p"} variant={"h3"}>
                    Name:{" "}
                  </Typography>
                  <TextField
                    placeholder="Name max 14 letters"
                    type="text"
                    maxLength="14"
                    onChange={(e) => props.changeFormInputName(e)}
                    variant={"filled"}
                  />
                  <Typography component={"p"} variant={"h3"}>
                    Description:
                  </Typography>
                  <TextField
                    variant={"filled"}
                    placeholder="Description max 30 letters"
                    type="text"
                    maxLength="30"
                    onChange={(e) => props.changeFormInputDescription(e)}
                  />
                  <Typography>Choose the File to upload as NFT</Typography>

                  <Input type="file" name="Asset" onChange={props.onChange} />
                  <br></br>
                  <br></br>
                  {props.networkChain.chainId !== 4002 && props.instance && (
                    <Box>
                      <Typography>
                        Hey! You are not connected to the fantom testnet. You
                        need to be on the fantom testnet network! Change network
                        here:
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={(e) => props.changeNetworkToFantomsTestnet()}
                      >
                        Switch to fantom testnet!
                      </Button>
                    </Box>
                  )}

                  {props.networkChain.chainId === 4002 && props.instance && (
                    <Box>
                      <Button
                        variant={"contained"}
                        sx={{ marginTop: "5px" }}
                        onClick={props.createMarket}
                      >
                        Mint NFT
                      </Button>
                    </Box>
                  )}
                  {!props.instance && (
                    <Box>
                      <Button
                        variant="outlined"
                        sx={{ marginTop: "5px" }}
                        onClick={(e) => props.connectWallet()}
                      >
                        Connect Wallet!
                      </Button>
                    </Box>
                  )}
                </div>
              </div>

              {props.fileURL && (
                <Box sx={{ marginTop: "10vh" }}>
                  <Paper elevation={24}>
                    <Box padding={1.5}>
                      <img
                        className="img1"
                        width={"258vw"}
                        height={"258vw"}
                        alt="NFT"
                        src={props.fileURL}
                      ></img>

                      <div>
                        <Typography component={"p"} variant={"h2"}>
                          NFT Name
                        </Typography>
                        <Typography
                          paddingBottom={"6vh"}
                          variant={"body2"}
                          component={"p"}
                        >
                          NFT Description
                        </Typography>
                        <Typography component={"p"} variant={"h3"}>
                          Price in Fantom
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          Current Seller: &nbsp;
                          {/*  {index.owner.substring(0, 5) +
                                  "..." +
                                  index.owner.substring(38)} */}
                        </Typography>
                        <Button
                          variant={"outlined"}

                          /*  onClick={() => props.buyNFT(index)} */
                        >
                          Buy NFT
                        </Button>
                      </div>
                    </Box>
                  </Paper>
                </Box>
              )}

              <br></br>
            </div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MintForm;
