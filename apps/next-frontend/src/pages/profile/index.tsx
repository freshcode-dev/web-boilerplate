import { ProfilePage, ProfilePageDefinition } from '@/modules/profile/pages/profile/profile.page';
import { NextPageWithMeta } from '@/modules/_core/types';
import { composeGetServerSideProps } from '@/modules/_core/utils/router.server.utils';

const Page: NextPageWithMeta = ProfilePage;

export const getServerSideProps = composeGetServerSideProps(ProfilePageDefinition);

export default Page;
