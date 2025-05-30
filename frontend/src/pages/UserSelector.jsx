import { useNavigate } from "react-router-dom";
const users = ["user1", "user2", "user3"];

export default function UserSelector() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    localStorage.setItem("currentUser", user);
    navigate("/notifications");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="bg-white px-12 py-8 rounded-2xl shadow-lg text-center">
        <h2 className="mb-8 text-indigo-800 font-bold tracking-wide text-2xl">Select a user</h2>
        <div className="flex gap-6 justify-center">
          {users.map((u) => (
            <button
              key={u}
              onClick={() => handleSelect(u)}
              className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold text-lg shadow transition-colors hover:bg-indigo-700"
            >
              Login as {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}