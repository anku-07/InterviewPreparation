# InterviewPreparation

import React, { useEffect, useState } from "react";
import SideBar from "../../common/sidebar";
import NavBar from "../../common/navbar";
import LogoBar from "../../common/logoheader";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {
  getAllStudentAward,
  getAllClass,
  addStudentAward,
  getByIdStudentAward,
  editStudentAward,
  deleteStudentAward,
  excelSheetStudentAward,
  exportAllStudentAwardPdf,
} from "../../../service/api";
const StudentAward = () => {
  const [mode, setMode] = useState("Add");
  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // Pagination
  function handleItemPerPageChange(e) {
    setItemsPerPage(e.target.value);
    setCurrentPage(1);
  }

  function handlePageClick(data) {
    setCurrentPage(data.selected + 1);
  }

  //   Toggle Drawer
  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  let resetForm = () => {
    setMode("Add");
    setOpen(true);
  };
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [classlist, setClasslist] = useState([]);
  const [sectionlist, setSectionlist] = useState([]); // section list
  const [studentlist, setStudentlist] = useState([]); // student list
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [winner, setWinner] = useState("");
  const [awardName, setAwardName] = useState("");
  const [giftItem, setGiftItem] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [awardReason, setAwardReason] = useState("");
  const [givenDate, setGivenDate] = useState("");
  const [editedId, setEditedId] = useState("");
  const [deletedId, setDeletedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const Session_id = useSelector((state) => state.session.sessionId);
  const OrganizationId = localStorage.getItem("organisationId");

  // fetch data
  const fetchData = async () => {
    try {
      const payload = {
        Session_id,
      };
      const response = await getAllStudentAward(payload);
      setData(response.data.documents);
      setFilterData(response.data.documents);
      console.log(response.data.documents);
    } catch (err) {
      console.log(err);
    }
  };

  // get all class
  const getAllClasslist = async () => {
    let response = await getAllClass({
      Oranization_id: OrganizationId,
      Session_id: `${Session_id}`,
      page: `${currentPage}`,
      limit: `${itemsPerPage}`,
    });
    setClasslist(response.data.classes);
    console.log(response.data.classes);
  };

  // handel class change
  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
    const selectedClassObj = classlist.find(
      (cls) => cls._id === selectedClassId
    );
    setSectionlist(selectedClassObj ? selectedClassObj.Sections : []);
  };

  // handel section change
  const handleSectionChange = (event) => {
    const selectedSectionId = event.target.value;
    setSelectedSection(selectedSectionId);
    const selectedSectionObj = sectionlist.find(
      (sec) => sec._id === selectedSectionId
    );
    setStudentlist(
      selectedSectionObj ? selectedSectionObj.assignedStudents : []
    );
  };
  // handel student
  const handelStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };
  // const handelWinnerName = (event) => {
  //   setWinner(event.target.value);
  // };

  //Handel Award Name
  const handelAwardName = (event) => {
    setAwardName(event.target.value);
  };

  // Handel GiftItem
  const handelGiftItem = (event) => {
    setGiftItem(event.target.value);
  };

  // Handel CashPrice
  const handelCashPrice = (event) => {
    setCashPrice(event.target.value);
  };

  // Handel AwardReason
  const handelAwardReason = (event) => {
    setAwardReason(event.target.value);
  };

  // Handel Date
  const handelGivenDate = (event) => {
    setGivenDate(event.target.value);
  };
  //  Add student Award
  const newAward = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        Session_id: Session_id,
        Branch_id: "",
        ClassId: selectedClass,
        SectionId: selectedSection,
        WinerName: selectedStudent,
        AwardName: awardName,
        GiftItem: giftItem,
        CashPrice: cashPrice,
        AwardReason: awardReason,
        GivenDate: givenDate,
      };

      const res = await addStudentAward(payload);
      // console.log(res.data);
      toast.success("Expense added successfully");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  //  Get by id student award
  const getByIdAwardData = async (id) => {
    try {
      setMode("edit");
      const res = await getByIdStudentAward(id);
      const data = {
        ...res.data,
        GivenDate: moment(res.data.GivenDate).format("YYYY-MM-DD"),
      };
      setEditedId(data._id);
      setWinner(data.WinerName);
      setSelectedClass(data.ClassId);
      setSelectedSection(data.SectionName);
      setAwardName(data.AwardName);
      setGiftItem(data.GiftItem);
      setCashPrice(data.CashPrice);
      setAwardReason(data.AwardReason);
      setGivenDate(data.GivenDate);
    } catch (err) {
      console.log(err);
    }
  };

  // Update student award
  const updateStudentAward = async () => {
    const payload = {
      ClassId: selectedClass,
      SectionId: selectedSection,
      WinerName: selectedStudent,
      AwardName: awardName,
      GiftItem: giftItem,
      CashPrice: cashPrice,
      AwardReason: awardReason,
      GivenDate: givenDate,
    };
    try {
      const res = await editStudentAward(editedId, payload);
      toast.success("Update Successfull");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  //  delete student award
  const deleteAward = async (id) => {
    try {
      const res = await deleteStudentAward(id);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const confirmDelete = (id) => {
    setDeletedId(id);
  };

  const deleteHandler = () => {
    deleteAward(deletedId);
    toast.success("Delete successfull");
  };

  const handleSearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchData = data.filter((item) =>
        item.WinerName.toLowerCase().includes(getSearch)
      );
      setData(searchData);
    } else {
      setData(filterData);
    }
    setSearchQuery(getSearch);
  };

  // export to excel
  const exportToExcel = async () => {
    try {
      const response = await excelSheetStudentAward();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Student Award.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching or downloading Excel:", error);
    }
  };

  // Export Pdf
  const exportToPdf = async () => {
    try {
      const response = await exportAllStudentAwardPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Student Award.pdf");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching or downloading PDF:", error);
    }
  };
  useEffect(() => {
    getAllClasslist();
  }, [OrganizationId, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [Session_id]);
  return (
    <div>
      <div className="wrapper">
        <div className="main-header">
          {/* Logo Header */}
          <LogoBar />
          {/* NavBar */}
          <NavBar />
        </div>
        {/* Side Bar */}
        <SideBar />
        <div className="main-panel">
          <div className="content">
            <div className="page-inner">
              {/* Title search bar csv pdf add button start here */}
              <div className="page-header">
                <h4 className="page-title">Student Award</h4>
                <ul className="breadcrumbs">
                  <li className="nav-home">
                    <a href="#">
                      <i className="flaticon-home" />
                    </a>
                  </li>
                  <li className="separator">
                    <i className="flaticon-right-arrow" />
                  </li>
                  <li className="nav-item">
                    <a href="#">Tables</a>
                  </li>
                  <li className="separator">
                    <i className="flaticon-right-arrow" />
                  </li>
                  <li className="nav-item">
                    <a href="#">Datatables</a>
                  </li>
                </ul>
                <form class="navbar-right navbar-form nav-search mr-md-5">
                  <div class="input-group mx-5">
                    <div class="input-group-prepend">
                      <button type="submit" class="btn btn-search pr-1">
                        <i class="fa fa-search search-icon"></i>
                      </button>
                    </div>
                    <input
                      value={searchQuery}
                      onChange={(e) => handleSearch(e)}
                      type="text"
                      placeholder="Search Group Name"
                      class="form-control"
                    />
                  </div>
                </form>
                <div className="mt-3 mt-md-0"></div>
                <div
                  className="btn-group ml-md-3"
                  role="group"
                  aria-label="Table Actions"
                >
                  <button
                    className="btn btn-outline-primary btn-icon mx-1 d-none d-md-inline"
                    onClick={exportToExcel}
                    title="Export In Excel"
                  >
                    <i
                      className="fas fa-file-excel text-success"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-icon mx-1 d-none d-md-inline"
                    title="Export In Pdf"
                    onClick={exportToPdf}
                  >
                    <i
                      className="fas fa-file-pdf text-danger"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </button>
                </div>
                <button
                  className="btn btn-outline-primary btn-round ml-auto"
                  onClick={resetForm}
                >
                  <span>
                    <i className="fa fa-plus" /> &nbsp; Add
                  </span>
                </button>
              </div>
              {/* Title search bar csv pdf add button end here */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          id="basic-datatables"
                          className="table table-hover"
                        >
                          {/* <table id="basic-datatables" className="display table table-striped table-hover"> */}
                          <thead style={{ backgroundColor: "#f0f0f0" }}>
                            <tr className="text-center">
                              <th>Sl</th>
                              <th>Winner</th>
                              {/* <th>Name</th> */}
                              <th>Class</th>
                              <th>Award Name</th>
                              <th>Gift Item</th>
                              <th>Cash Price</th>
                              <th>Award Reason</th>
                              <th>Given Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          {/* <tfoot></tfoot> */}
                          <tbody>
                            {data.map((item, i) => {
                              return (
                                <tr key={item._id} className="text-center">
                                  <td>{i + 1}</td>
                                  {/* <td>{item.Roleid.roleName}</td> */}
                                  <td>{item.WinerName}</td>
                                  <td>{item.ClassId?.Classes}</td>
                                  <td>{item.AwardName}</td>
                                  <td>{item.GiftItem}</td>
                                  <td>{item.CashPrice}</td>
                                  <td>{item.AwardReason}</td>
                                  <td>
                                    {moment(item.GivenDate).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div className="form-button-action">
                                      <button
                                        type="button"
                                        data-toggle="modal"
                                        data-target="#expenseDetailsModal"
                                        onClick={() => {
                                          viewExpenseData(item);
                                        }}
                                        title="view more deatils"
                                        className="btn btn-icon  btn-light btn-sm mx-1"
                                        data-original-title="View More"
                                      >
                                        <i className="fas fa-bars text-info" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          getByIdAwardData(item._id);
                                          setOpen(true);
                                        }}
                                        title="Edit New Deposite"
                                        className="btn btn-icon btn-light  btn-sm mx-2"
                                        data-original-title="Edit Task"
                                      >
                                        <i className="fa fa-edit text-primary" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Delete New Deposite"
                                        className="btn btn-icon btn-light btn-sm mx-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                      >
                                        <i
                                          className="fas fa-trash-alt text-danger"
                                          onClick={() =>
                                            confirmDelete(item._id)
                                          }
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="row d-flex mt-3 justify-content-between w-100">
                          <div className="col-md-4 d-flex justify-content-start align-items-center">
                            <label htmlFor="itemPerPage">
                              Select item per page
                            </label>
                            <select
                              id="itemPerPage"
                              className=""
                              onChange={handleItemPerPageChange}
                              value={itemsPerPage}
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                            </select>
                          </div>
                          <div className="col-md-4 justify-content-center align-items-center">
                            <ReactPaginate
                              previousLabel="previous"
                              nextLabel="next"
                              breakLabel="..."
                              pageCount={totalPage}
                              onPageChange={handlePageClick}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={3}
                              containerClassName={"pagination"}
                              pageClassName={"page-item"}
                              pageLinkClassName={"page-link"}
                              previousClassName={"page-item"}
                              previousLinkClassName="page-link"
                              nextClassName="page-item"
                              nextLinkClassName="page-link"
                              breakClassName="page-item"
                              breakLinkClassName="page-link"
                              activeClassName={"active"}
                            />
                          </div>
                          <div className="col-md-4 d-flex justify-content-end align-items-center">
                            <p>
                              {itemsPerPage > data?.length
                                ? `Showing 1 to ${data?.length} of ${data?.length}`
                                : `Showing ${
                                    (currentPage - 1) * itemsPerPage + 1
                                  } to ${Math.min(
                                    currentPage * itemsPerPage,
                                    data?.length
                                  )} of ${data?.length}`}
                            </p>
                          </div>
                        </div>
                        <ToastContainer />
                        {/* Pagination */}
                        {/* <ToastContainer /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add and Edit Modal */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          p={3}
          width={{
            xs: "100%", // Full width on extra small screens
            sm: 400, // 300 pixels on small screens and above
            md: "40vw", // 400 pixels on medium screens and above
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Typography variant="h6">
              {mode === "Add" ? (
                <span className="fw-mediumbold text-black me-1">
                  Add Award{" "}
                </span>
              ) : (
                <span className="fw-mediumbold text-black me-1">Edit </span>
              )}
            </Typography>
            <IconButton color="primary" onClick={toggleDrawer(false)}>
              <CloseIcon style={{ color: "red" }} />
            </IconButton>
          </Box>
          <div className="modal-body">
            {/* Your form or content for adding a user goes here */}
            {/* Example: */}
            <form>
              <div className="form-group">
                <label htmlFor="role">Class *</label>
                <select
                  id="role"
                  name="role"
                  className="form-control"
                  onChange={handleClassChange}
                >
                  {mode === "Add" ? (
                    <option>Select</option>
                  ) : (
                    <option>{selectedClass.Classes}</option>
                  )}
                  {classlist.map((item, i) => (
                    <option key={item._id} value={item._id}>
                      {item.Classes}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="account">Section *</label>
                <select className="form-control" onChange={handleSectionChange}>
                  {mode === "Add" ? (
                    <option>Select</option>
                  ) : (
                    <option>{selectedSection}</option>
                  )}
                  {sectionlist.map((item, i) => (
                    <option key={item._id} value={item._id}>
                      {item.secName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="student">Winner *</label>
                <select
                  className="form-control"
                  id="student"
                  name="student"
                  onChange={handelStudentChange}
                >
                  {mode === "Add" ? (
                    <option value="">Select</option>
                  ) : (
                    <option value="">{winner}</option>
                  )}
                  {studentlist.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="account">Award Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={awardName}
                  placeholder="Award Name"
                  onChange={handelAwardName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="account">Gift Item *</label>
                <input
                  type="text"
                  className="form-control"
                  value={giftItem}
                  placeholder="Gift Item"
                  onChange={handelGiftItem}
                />
              </div>
              <div className="form-group">
                <label htmlFor="account">Cash Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={cashPrice}
                  placeholder="Cash Price"
                  onChange={handelCashPrice}
                />
              </div>
              <div className="form-group">
                <label htmlFor="account">Award Reason</label>
                <input
                  type="text"
                  className="form-control"
                  value={awardReason}
                  placeholder="Award Reason"
                  onChange={handelAwardReason}
                />
              </div>
              <div className="form-group">
                <label htmlFor="account">Given Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={givenDate}
                  onChange={handelGivenDate}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            {mode === "Add" ? (
              <button
                className="btn btn-primary"
                variant="contained"
                color="primary"
                onClick={newAward}
              >
                Add
              </button>
            ) : (
              <button
                className="btn btn-primary"
                variant="contained"
                color="primary"
                onClick={updateStudentAward}
              >
                Update
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={toggleDrawer(false)}
              variant="contained"
              color="error"
            >
              Close
            </button>
          </div>
        </Box>
      </Drawer>

      {/* Delete Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Confirm Delete
              </h1>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">You want to delete your data?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={deleteHandler}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAward;
