export const useUser = () => {
  const { user } = useAuth();
  return user;
};
