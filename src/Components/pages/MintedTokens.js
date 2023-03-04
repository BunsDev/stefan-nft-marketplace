import { Typography, Box, Paper, Grid, Container, Button } from "@mui/material";
import Footer from "../Footer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const MintedTokens = (props) => {
  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Box
        sx={{
          color: "white",
          paddingLeft: "5px",
        }}
      >
        <ArrowUpwardIcon sx={{ fontSize: 60 }} />
        Check our Services!
      </Box>
      <Container>
        <Box paddingTop={"20vh"} marginBottom={"5vh"}>
          <Box id="pages" paddingBottom={"10vh"}>
            <form className="form-inline text-center">
              <i className="fas fa-cat"></i>
            </form>
            <Typography
              Component={"h2"}
              variant={"h1"}
              align="center"
              color={"secondary"}
            >
              NFT's you have minted!
            </Typography>
            {!props.instance && !props.network.chainId && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant={"h2"} component={"h2"}>
                  Hey you need to login first before you can see your Minted
                  NFTs!
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ marginTop: "5px" }}
                  onClick={(e) => props.connectWallet()}
                >
                  Connect Wallet!
                </Button>
              </Box>
            )}
            {props.network.chainId !== 5 && props.instance && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant={"h2"} component={"h2"}>
                  Wrong network
                </Typography>
                <Button
                  variant={"outlined"}
                  onClick={(e) => props.changeNetworkToGoerli(e)}
                >
                  Connect to Goerli!
                </Button>
              </Box>
            )}
            {props.network.chainId === 5 && props.instance && (
              <div
                className="col-md-10 offset-md-1 "
                style={{ marginTop: "6vh" }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    onClick={(e) => props.loadMintedNFTs()}
                    sx={{ color: "black", marginBottom: "10px" }}
                    variant="contained"
                  >
                    {" "}
                    Refresh
                  </Button>
                </Box>

                <Container>
                  <Box>
                    <Grid container spacing={4}>
                      {props.mintedNFTs.map((index) => {
                        return (
                          <Grid item xs={4} key={index.tokenId}>
                            <Paper elevation={24}>
                              <Box padding={1.5}>
                                <img
                                  width={"258vw"}
                                  height={"258vh"}
                                  alt="NFT"
                                  src={index.image}
                                ></img>

                                <Typography component={"p"} variant={"h2"}>
                                  {index.name}
                                </Typography>
                                <Typography
                                  paddingBottom={"6vh"}
                                  variant={"body2"}
                                  component={"p"}
                                >
                                  {index.description}
                                </Typography>

                                <Typography component={"p"} variant={"h3"}>
                                  {index.price} Ether
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Container>
              </div>
            )}

            {props.mintedNFTs.length === 0 &&
              props.network.chainId === 5 &&
              props.instance && (
                <h1 className="text-center " style={{ marginTop: "4vh" }}>
                  You have not minted any NFTs yet!
                </h1>
              )}
          </Box>
        </Box>
        <Footer />
      </Container>
    </Box>
  );
};

export default MintedTokens;
