<template>
  <div class="flex justify-center items-center w-full p-8">
    <div class="max-w-3xl">
      <article>
        <h1 class="font-bold text-4xl">COOKIE POLICY</h1>

        <p class="mt-5 font-semibold text-gray-500">
          Last updated June 07, 2021
        </p>

        <p class="mt-5">
          This Cookie Policy explains how we uses cookies and similar
          technologies to recognize you when you visit our websites at
          https://socaves.com, ("Websites"). It explains what these technologies
          are and why we use them, as well as your rights to control our use of
          them.
        </p>

        <p class="mt-3">
          In some cases we may use cookies to collect personal information, or
          that becomes personal information if we combine it with other
          information.
        </p>
      </article>

      <article class="mt-8">
        <h2 class="font-bold text-3xl">What are cookies?</h2>

        <p class="mt-5">
          Cookies are small data files that are placed on your computer or
          mobile device when you visit a website. Cookies are widely used by
          website owners in order to make their websites work, or to work more
          efficiently, as well as to provide reporting information.
        </p>

        <p class="mt-3">
          Cookies set by the website owner (in this case, lang and auth) are
          called "first party cookies". Cookies set by parties other than the
          website owner are called "third party cookies". Third party cookies
          enable third party features or functionality to be provided on or
          through the website (e.g. like advertising, interactive content and
          analytics). The parties that set these third party cookies can
          recognize your computer both when it visits the website in question
          and also when it visits certain other websites
        </p>
      </article>

      <article class="mt-8">
        <h2 class="font-bold text-3xl">Why do we use cookies?</h2>

        <p class="mt-5">
          We use first and third party cookies for several reasons. Some cookies
          are required for technical reasons in order for our Websites to
          operate, and we refer to these as "essential" or "strictly necessary"
          cookies. Other cookies also enable us to track and target the
          interests of our users to enhance the experience on our Online
          Properties. Third parties serve cookies through our Websites for
          advertising, analytics and other purposes. This is described in more
          detail below.
        </p>

        <p class="mt-3">
          The specific types of first and third party cookies served through our
          Websites and the purposes they perform are described below (please
          note that the specific cookies served may vary depending on the
          specific Online Properties you visit):
        </p>
      </article>

      <!-- <article class="mt-8">
        <h2 class="font-bold text-3xl">How can I control cookies?</h2>

        <p class="mt-5">
          You have the right to decide whether to accept or reject cookies. You
          can exercise your cookie rights by setting your preferences in the
          Cookie Consent Manager. The Cookie Consent Manager allows you to
          select which categories of cookies you accept or reject. Essential
          cookies cannot be rejected as they are strictly necessary to provide
          you with services.
        </p>

        <p class="mt-3">
          The specific types of first and third party cookies served through our
          Websites and the purposes they perform are described below (please
          note that the specific cookies served may vary depending on the
          specific Online Properties you visit):
        </p>
      </article> -->

      <article class="mt-8">
        <h2 class="font-bold text-3xl">Essential website cookies</h2>

        <p class="mt-5">
          These cookies are strictly necessary to provide you with services
          available through our Websites and to use some of its features, such
          as access to secure areas.
        </p>

        <div class="my-3">
          <p>auth._token_expiration.cookie</p>
          <p>lang auth._token.cookie</p>
          <p>jwt</p>
          <p>auth.strategy</p>
        </div>
      </article>

      <article class="mt-8">
        <h2 class="font-bold text-3xl">
          How often will you update this Cookie Policy?
        </h2>

        <p class="mt-5">
          We may update this Cookie Policy from time to time in order to
          reflect, for example, changes to the cookies we use or for other
          operational, legal or regulatory reasons. Please therefore re-visit
          this Cookie Policy regularly to stay informed about our use of cookies
          and related technologies.
        </p>

        <p class="mt-3">
          The date at the top of this Cookie Policy indicates when it was last
          updated.
        </p>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t('signup.cookie_policy'),
    };
  },
};
</script>
