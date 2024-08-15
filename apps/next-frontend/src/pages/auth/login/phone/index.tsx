import { composeGetServerSideProps } from '@/modules/_core/utils/router.server.utils';
import { LoginWithPhonePage, LoginWithPhonePageDefinition } from '@/modules/auth/pages/login-with-phone/login-with-phone.page';
import { NextPageWithMeta } from '@/modules/_core/types';

const Page: NextPageWithMeta = LoginWithPhonePage;

export const getServerSideProps = composeGetServerSideProps(LoginWithPhonePageDefinition);

export default Page;
