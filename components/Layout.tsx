import Head from 'next/head'

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Multiply you DFC - DFCFactor</title>
        <link
          rel="stylesheet"
          href="/lib/bootstrap/dist/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/css/site.css" />
      </Head>

      {children}

      <script src="/lib/jquery/dist/jquery.min.js"></script>
      <script src="/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  )
}

export default Layout
