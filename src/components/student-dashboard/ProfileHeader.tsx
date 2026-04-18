import type { User } from '@/types/user';
import DashboardProfileHero from '@/components/shared/DashboardProfileHero';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const studentType = user.interestedCourse ? `${user.interestedCourse} Student` : 'Student';

  return (
    <DashboardProfileHero
      fullName={`${user.firstName} ${user.lastName}`}
      subtitle={studentType}
      photoUrl={user.photo}
      fallbackName={`${user.firstName} ${user.lastName}`}
      buttonLabel="Edit Profile"
      onActionClick={onEditClick}
    />
  );
};

export default ProfileHeader;
