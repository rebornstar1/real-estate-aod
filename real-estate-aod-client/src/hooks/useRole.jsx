import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";



const useRole = (email) => {

    const axiosPublic = useAxiosPublic()
    // console.log(email);
      const { data: role='' ,isLoading } = useQuery({
        queryKey: ["user-key",email],
        queryFn: async () => {
          const res = await axiosPublic.get(`/api/v1/users/role?email=${email}`);
          console.log("res",res);
          console.log("email",email);
          return res.data;
        }
      })
      return [role ,isLoading]

};

export default useRole;