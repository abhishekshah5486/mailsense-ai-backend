const { generateResponse } = require('../Services/OpenAIService');

const thread = [
    {
      "id": "1916cb3fde9851ca",
      "from": "Codeforces@codeforces.com",
      "to": "nareshdb555@gmail.com",
      "subject": "Codeforces Round 967 (Div. 2)",
      "date": "Mon, 19 Aug 2024 23:30:52 +0300 (MSK)",
      "body": "Hello, naresh50. Welcome to the regular Codeforces round.\r\n\r\nI'm glad to invite you to take part in Codeforces Round 967 (Div. 2). It starts on Tuesday, August, 20, 2024 14:35 (UTC). The contest duration is 2 hours. The allowed programming languages are C/C++, Pascal, Perl, Java, C#, Python (2 and 3), Ruby, PHP, Haskell, Scala, OCaml, D, Go, JavaScript and Kotlin.\r\n\r\nThe round writer is Misuki. Do not miss the round!\r\n\r\nThe round will be held on the rules of Codeforces, so read the rules (here and here) beforehand.\r\n\r\nIt will be for newcomers or participants from the second division (non-rated users or those having less than 2100 rating points). Want to compete? Do not forget to register for the contest and check your handle on the registrants page. The registration will be closed 5 minutes before the contest.\r\n\r\nRegister Now →  If you have any questions, please feel free to ask me on the pages of Codeforces. If you no longer wish to receive these emails, click https://codeforces.com/unsubscribe/contests/d7c5a10720bb43a356a579e325a9d1aabd7ebf4b/ to unsubscribe.\r\n\r\nWish you high rating, MikeMirzayanov and Codeforces team"
    }
]

const response = generateResponse(thread);
response.then((res) => {
    console.log(res);
})