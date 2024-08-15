import { composeGetServerSideProps } from '@/modules/_core/utils/router.server.utils';
import { ProfileSecurityPage, ProfileSecurityPageDefinition } from '@/modules/profile/pages/security/security.page';

const Page = ProfileSecurityPage;

export const getServerSideProps = composeGetServerSideProps(ProfileSecurityPageDefinition);

export default Page;
