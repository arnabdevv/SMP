import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [error, setError] = useState(null);

  // Fetch all classes for dropdown
  useEffect(() => {
    axios
      .get("http://localhost:3000/class/all")
      .then((res) => setClasses(res.data.classes))
      .catch((err) => setError(err.message));
  }, []);

  // Update batch dropdown when class changes
  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find((c) => c._id === selectedClass);
      setBatches(cls ? cls.batches : []);
      setSelectedBatch("");
    } else {
      setBatches([]);
    }
  }, [selectedClass, classes]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;
      if (selectedBatch) params.batchId = selectedBatch;

      const res = await axios.get("http://localhost:3000/student/list", {
        params,
        withCredentials: true, // needed if using cookie/session auth
      });
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Class dropdown */}
      <label>
        Class:{" "}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">All</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </label>

      {/* Batch dropdown */}
      <label style={{ marginLeft: "10px" }}>
        Batch:{" "}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          disabled={!batches.length}
        >
          <option value="">All</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
      </label>

      {/* Fetch button */}
      <button
        onClick={fetchStudents}
        style={{
          marginLeft: "10px",
          padding: "5px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Get Students
      </button>

      {/* Students table */}
      {students.length > 0 && (
        <table
          style={{
            marginTop: "20px",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone Number</th>
              <th style={thStyle}>Parent Phone</th>
              <th style={thStyle}>Class</th>
              <th style={thStyle}>Batch</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td style={tdStyle}>{student.fullName}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.phoneNumber}</td>
                <td style={tdStyle}>{student.parentPhoneNumber}</td>
                <td style={tdStyle}>{student.classRef?.name}</td>
                <td style={tdStyle}>{student.batchRef?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};
