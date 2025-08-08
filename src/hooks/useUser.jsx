import { useEffect, useState } from "react";
import axios from "axios";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserLoading(false);
        setUserError("No token found");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err.message);
        setUserError(err.message);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { user, userLoading, userError };
};

export default useUser;
