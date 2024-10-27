type ViewUserMailProps = {
  email: string;
};

export const ViewUserMail = ({ email }: ViewUserMailProps) => {
  return <div className="grid gap-2">Email: {email}</div>;
};
