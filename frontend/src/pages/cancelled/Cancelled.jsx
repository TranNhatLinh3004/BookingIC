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
function Cancelled(props) {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");

  const nav__links = [
    // {
    //   path: "/home",
    //   display: "Chờ xác nhận",
    // },
    // {
    //   path: "/hotels",
    //   display: "Trống",
    // },
    // {
    //   path: "/reached",
    //   display: "Đã đặt",
    // },
    // {
    //   path: "/out-of-date",
    //   display: "Quá hạn",
    // },
    {
      path: "/goc-cam-hung",
      display: "Hoàn tất mục cho thuê của bạn",
    },
  ];

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleaccessBooking = async (leaveData) => {
    // const leaveData = dataLeave[0];
    const newData = {
      bookingId: leaveData._id,
      subtotal: leaveData.rooms.reduce((total, room) => total + room.price, 0),
      userId: userData._id,
      name: leaveData.name,
      phone: leaveData.phone,
      rooms: leaveData.rooms.map((room) => ({
        roomId: room.roomId,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          number: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates.map((dateString) => {
            const dateOnly = dateString.substring(0, 10);
            return dateOnly;
          }),
        })),
      })),
    };
    console.log(newData, "newwwwwwwwwwwww");
    await accessBooking(newData);
  };
  const accessBooking = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/booking/accessBooking`,
        data
      );
      if (response) {
        setReloadData((prev) => !prev);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const [reloadData, setReloadData] = useState(false);
  const handleReloadData = () => {
    setReloadData((prev) => !prev);
  };
  const userData = useSelector((state) => state.user);

  const [dataLeave, setDataLeave] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/find/${userData._id}`
        );
        console.log(response.data);

        // getbookingLeaveById(userData._id);
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [reloadData]);
  const [menu, setMenu] = useState(true);
  const hanldeRoomStatus = async (bookingId, status) => {
    console.log(bookingId, "<bookingId></bookingId>");
    try {
      let updatedStatus;
      if (status === "checked-in") {
        updatedStatus = "checked-in";
      } else if (status === "checked-out") {
        updatedStatus = "completed";
      } else {
        throw new Error("Invalid status");
      }

      const response = await axios.put(
        `http://localhost:5000/api/booking/update-status/${bookingId}`,
        {
          status: updatedStatus,
        }
      );

      if (response) {
        handleReloadData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filteredDataLeave = searchQuery
    ? dataLeave.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone.toString().includes(searchQuery)
      )
    : dataLeave;
  return (
    <div>
      <div className="wrapper__manage">
        <div className="heading">
          <h4>Tình trạng phòng:</h4>
          <input
            type="text"
            placeholder="Tìm kiếm khách theo tên hoặc số điện thoại"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginLeft: "20px", padding: "5px" }}
            className="value__search"
          />
          <div className={menu ? "navigation" : "navigation active"}>
            <ul className="menu">
              {nav__links.map((item, index) => {
                return (
                  <li className="" key={index}>
                    <Link
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}{" "}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          style={{
            height: "20px",
          }}
        ></div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Khách sạn</TableCell>
                <TableCell>Giá tiền (VNĐ)</TableCell>
                <TableCell>Số phòng</TableCell>
                <TableCell>Thời gian đặt phòng</TableCell>
                <TableCell>Ngày đặt/trả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
                {/* <TableCell>Chấp nhận</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataLeave
                .filter((item) => item.status === "cancelled")
                .map((item, index) => (
                  <React.Fragment key={item._id}>
                    {item.rooms.map((room) => (
                      <React.Fragment key={room._id}>
                        {room.roomNumbers.map((roomNumber) => (
                          <TableRow key={roomNumber._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>(+84) {item.phone}</TableCell>

                            <TableCell>
                              {/* {hotelNames[item.hotel] || "Đang tải..."} */}
                              {item.nameHotel}
                            </TableCell>
                            <TableCell>
                              {formatNumberWithCommas(item.totalPrice)}
                            </TableCell>
                            <TableCell>{roomNumber.number}</TableCell>
                            <TableCell>
                              {format(
                                new Date(item.createdAt),
                                "HH:mm dd-MM-yyyy"
                              )}
                            </TableCell>
                            <TableCell>
                              {roomNumber.unavailableDates
                                .map((dateString) => {
                                  const dateOnly = dateString.substring(0, 10);
                                  return dateOnly;
                                })
                                .join(", ")}
                            </TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>
                              {item.status === "confirmed" && (
                                <button
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                  onClick={() =>
                                    hanldeRoomStatus(item._id, "checked-in")
                                  }
                                >
                                  Check-in
                                </button>
                              )}
                              {item.status === "checked-in" && (
                                <button
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                  onClick={() =>
                                    hanldeRoomStatus(item._id, "checked-out")
                                  }
                                >
                                  Check-out
                                </button>
                              )}
                              {/* {item.status === "checked-out" && <p></p>} */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )) || "Đang tải..."}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Cancelled;
