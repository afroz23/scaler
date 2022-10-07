import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
  Col,
  Row,
  Alert,
  Spinner,
  Table,
} from "react-bootstrap";
import { MdModeEditOutline } from "react-icons/md";
import "./App.css";
import axios from "axios";

function App() {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);

  const [startDate, setStartDate] = useState(new Date().getTime());
  const [endDate, setEndDate] = useState(new Date().getTime());
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [disable, setDisable] = useState(false);
  const [sucess, setSucess] = useState(false);

  const [interviews, setInterviews] = useState([]);

  const [filter, setFilter] = useState([]);
  const [count, setCount] = useState(0);
  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    let x = interviews.filter(
      (interview) =>
        interview.title.slice(0, value.length).toLowerCase() ===
        value.toLowerCase()
    );
    setFilter(x);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_URL}/api/users`)
      .then((res) => {
        const users = res.data.map((user) => ({
          label: user.name,
          value: user._id,
        }));
        setOptions(users);
      })
      .catch((err) => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading2(true);
    axios
      .get(`${process.env.REACT_APP_URL}/api/interview/allinterview`)
      .then((res) => {
        setInterviews(res.data);
        setFilter(res.data);
      })
      .catch((err) => setError("Something went wrong"))
      .finally(() => setLoading2(false));
  }, [count]);

  const scheduleInterview = (e) => {
    e.preventDefault();
    setDisable(true);
    let users = selected.map((user) => ({
      name: user.label,
      _id: user.value,
      interviews: user.interviews,
    }));

    const user = {
      title: title,
      users: users,
      startTime: startDate,
      endTime: endDate,
    };

    if (editId) {
      axios
        .put(`${process.env.REACT_APP_URL}/api/interview/edit/${editId}`, user)
        .then((res) => {
          setSucess("Interview updated");
          setError("");
          setTitle("");
          setSelected([]);
          setCount(count + 1);
          setStartDate(new Date().getTime());
          setEndDate(new Date().getTime());
          setTimeout(() => setSucess(""), 5000);
        })
        .catch((err) => console.log(err))
        .finally(() => setDisable(false));
    } else {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/api/interview/create`,
        data: user,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          setSucess("Interview scheduled");
          setError("");
          setTitle("");
          setSelected([]);
          setCount(count + 1);
          setStartDate(new Date().getTime());
          setEndDate(new Date().getTime());
          setTimeout(() => setSucess(""), 5000);
        })
        .catch((error) => {
          let err = "";
          if (error.response.status === 500) {
            let { name, startTime, endTime } = error.response.data;

            let start = new Date(startTime);
            let [sDate, sTime] = getDateAndTime(start);

            let end = new Date(endTime);
            let [eDate, eTime] = getDateAndTime(end);

            err = `${name}'s interview is already scheduled between ${sDate} ${sTime} to ${eDate} ${eTime}`;
          } else {
            err = error.response.data;
          }
          setError(err);
        })
        .finally(() => setDisable(false));
    }
  };

  if (loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const editInterview = (item) => {
    setTitle(item.title);
    const users = item.participants.map((user) => ({
      label: user.name,
      value: user._id,
    }));
    setSelected(users);
    setStartDate(item.startTime);
    setEndDate(item.endTime);
    setEditId(item._id);
  };

  function getDateAndTime(date) {
    let sDate =
      date.getDate() +
      "-" +
      parseInt(date.getMonth() + 1) +
      "-" +
      date.getFullYear();

    let sHour = date.getHours() === 0 ? "00" : date.getHours();
    let sMinute = date.getMinutes() === 0 ? "00" : date.getMinutes();
    let sTime = sHour + ":" + sMinute;
    return [sDate, sTime];
  }

  return (
    <>
      <div className="header">
        <Alert variant="primary">Scaler SDE Intern Assignment</Alert>
      </div>
      <div className="App">
        <Container>
          <Row>
            <Form className="form" onSubmit={scheduleInterview}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className="inline">Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Select participants</Form.Label>
                    <MultiSelect
                      options={options}
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>Start time</Form.Label>
                    <Datetime
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date._d.getTime());
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>End time</Form.Label>
                    <Datetime
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(date._d.getTime());
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {error && <Alert variant="danger">{error}</Alert>}
              {sucess && <Alert variant="primary">{sucess}</Alert>}
              <Button variant="primary" type="submit" disabled={disable}>
                Schedule Interview
              </Button>
            </Form>
          </Row>
          <br />
          <input
            name="search"
            value={search}
            onChange={(e) => handleSearch(e)}
          />
          <div>
            <Alert variant="primary">Upcomming interviews</Alert>
          </div>
          {loading2 ? (
            <div className="spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : interviews.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Participants</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filter.map((item) => {
                  let today = new Date();

                  let start = new Date(item.startTime);
                  let [sDate, sTime] = getDateAndTime(start);

                  let end = new Date(item.endTime);
                  let [eDate, eTime] = getDateAndTime(end);

                  if (start.getTime() < today.getTime()) {
                    return;
                  }

                  return (
                    <tr key={item._id}>
                      <td>#</td>
                      <td>{item.title}</td>
                      <td>
                        {item.participants.map((user) => (
                          <span className="name" key={user._id}>
                            {user.name}
                          </span>
                        ))}
                      </td>
                      <td>
                        {sDate}
                        <br />
                        {sTime}
                      </td>
                      <td>
                        {eDate}
                        <br />
                        {eTime}
                      </td>
                      <td>
                        <div
                          className="edit-btn"
                          onClick={() => editInterview(item)}
                        >
                          <MdModeEditOutline />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <h3>No interviews are scheduled</h3>
          )}
        </Container>
      </div>
    </>
  );
}

export default App;