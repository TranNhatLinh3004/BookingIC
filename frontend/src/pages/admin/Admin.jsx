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
function Admin(props) {
  const classes = useStyles();
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/`);
        setListUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {};

  console.log(listUser);
  return (
    <div>
      <div className="wrapper__manage">
        <div className="heading">
          <h4>Dashboard Admin:</h4>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>UserName</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listUser.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                      }}
                      src={user.avatar}
                      alt=""
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>
                    <Link to={`/account/${user._id}`}>
                      <button>Detail</button>
                    </Link>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Admin;
