import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { loginSuccess } from "../redux/userSlice";
import { api } from "../utils/end";

const Register = () => {
  const [userData, setuserData] = useState({});
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await fetch(`${api}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        setloading(false);
        return seterror(data.error);
      }
      setloading(false);
      dispatch(loginSuccess(data))
      seterror("");
      navigate('/')
    } catch (error) {
      seterror(error);
      setloading(false);
    }
  };

  return (
    <div className="max-w-lg m-auto mt-9 px-2">
      <form onSubmit={handleSubmit} className=" flex flex-col gap-3">
        <h1 className=" text-3xl text-center text-slate-700">
          Create an account
        </h1>
        <input
          onChange={handleChange}
          className=" border rounded-lg p-3 "
          type="text"
          name="username"
          placeholder="username"
        />
        <input
          onChange={handleChange}
          className=" border rounded-lg p-3 "
          type="email"
          name="email"
          placeholder="email"
        />
        <input
          onChange={handleChange}
          className=" border rounded-lg p-3 "
          type="password"
          name="password"
          placeholder="password"
        />
        <button className=" uppercase p-3 rounded-lg bg-slate-700 text-white hover:opacity-95">
          {loading ? "loading..." : "register"}
        </button>
      </form>
      <div className=" mt-3">
        <p>
          Already have an account?{" "}
          <Link className=" underline" to="/login">
            Login
          </Link>
        </p>
      </div>
      {error && <p className=" text-red-700">{error}</p>}
    </div>
  );
};

export default Register;
