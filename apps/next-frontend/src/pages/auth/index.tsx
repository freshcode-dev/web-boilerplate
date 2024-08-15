import { composeGetServerSideProps } from '@/modules/_core/utils/router.server.utils';
import { AuthRoutes } from '@/modules/auth/constants';
import { NextPageWithMeta } from '@/modules/_core/types';

const Page: NextPageWithMeta = () => null;

export const getServerSideProps = composeGetServerSideProps(null, (store) => async () => ({
	redirect: {
		destination: AuthRoutes.LoginPhone,
		permanent: true,
	},
}));

export default Page;
