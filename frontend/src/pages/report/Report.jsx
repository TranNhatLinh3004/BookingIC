import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { format } from "date-fns";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
function Report(props) {
  const classes = useStyles();
  const [userId, setUserId] = useState(null);
  const [dataLeave, setDataLeave] = useState(null);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      // Parse the JSON string back into an object
      const user = JSON.parse(userData);
      // Set the userId state with the _id property from user object
      setUserId(user._id);
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/report/hotel/revenue`
        );
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(dataLeave, "âs");

  return (
    <div>
      <div className="wrapper__manage">
        <div className="heading">
          <h4>Thống kê:</h4>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Khách sạn</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Tổng số phòng</TableCell>
                <TableCell>Doanh thu</TableCell>
                <TableCell>Đánh giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataLeave !== null ? (
                dataLeave
                  .filter((item) => item.hotelUserId === userId)
                  .map((item, index) => (
                    <TableRow key={item.hotelId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                            src={item.hotelPhotos[0]}
                            alt={item.hotelName}
                          />
                          {item.hotelName}
                        </div>
                      </TableCell>
                      <TableCell>{item.hotelCity}</TableCell>
                      <TableCell>{item.hotelRooms}</TableCell>
                      <TableCell>
                        {formatNumberWithCommas(item.totalRevenue)}
                      </TableCell>
                      <TableCell>{item.hotelRating}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Report;
