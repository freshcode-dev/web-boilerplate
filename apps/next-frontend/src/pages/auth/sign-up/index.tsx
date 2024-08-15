import { composeGetServerSideProps } from '@/modules/_core/utils/router.server.utils';
import { SignUpWithEmailPage, SignUpWithEmailPageDefinition } from '@/modules/auth';

const Page = SignUpWithEmailPage;

export const getServerSideProps = composeGetServerSideProps(SignUpWithEmailPageDefinition);

export default Page;
