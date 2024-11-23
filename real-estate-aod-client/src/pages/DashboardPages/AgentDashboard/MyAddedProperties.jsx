import { useQuery } from "@tanstack/react-query";
import HeaderText from "../../../components/HeaderText/HeaderText";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import AddedPropertyCard from "../../../components/Cards/AddedPropertyCard";

const MyAddedProperties = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["agent-property"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/v1/properties?email=${user?.email}`);
      return res.data;
    },
  });

  const agentProperties = data?.propertiesData;

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderText headerText="My Added Properties" />

      {isLoading ? (
        <div className="flex flex-wrap justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {agentProperties?.map((property) => (
            <AddedPropertyCard key={property._id} property={property} refetch={refetch} />
          ))}
        </div>
      )}

      {!isLoading && (!agentProperties || agentProperties.length === 0) && (
        <div className="text-center text-gray-500 mt-8">
          No properties found. Add some properties to see them here.
        </div>
      )}
    </div>
  );
};

export default MyAddedProperties;
