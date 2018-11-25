export const test: SimilarAPIResponse = {
  items: [{
    tags: [
      "javascript",
      "loops",
      "for-loop"
    ],
    answers: [{
      owner: {
        reputation: 2504,
        user_id: 708728,
        user_type: "registered",
        profile_image: "https://www.gravatar.com/avatar/c798e00e7004e482515a10f388a86665?s=128&d=identicon&r=PG",
        display_name: "MDiesel",
        link: "https://stackoverflow.com/users/708728/mdiesel"
      },
      is_accepted: false,
      score: 1,
      last_activity_date: 1399404161,
      creation_date: 1399404161,
      answer_id: 23503207,
      question_id: 23503166,
      link: "https://stackoverflow.com/questions/23503166/for-loop-in-js-only-returns-first-value/23503207#23503207",
      body: "<p>You need to have your return statement outside of the loop:</p>\n\n<pre><code>function FirstFactorial (num) { \n    var myVar=1;\n    for(var i=1; i&lt;=num; i++){\n        myVar=myVar*i;\n\n    }\n    return myVar;\n};\n</code></pre>\n"
    },
      {
        owner: {
          reputation: 2254,
          user_id: 2175593,
          user_type: "registered",
          accept_rate: 71,
          profile_image: "https://i.stack.imgur.com/LXoPR.png?s=128&g=1",
          display_name: "WillardSolutions",
          link: "https://stackoverflow.com/users/2175593/willardsolutions"
        },
        is_accepted: false,
        score: 1,
        last_activity_date: 1399404200,
        creation_date: 1399404200,
        answer_id: 23503218,
        question_id: 23503166,
        link: "https://stackoverflow.com/questions/23503166/for-loop-in-js-only-returns-first-value/23503218#23503218",
        body: "<p>Take the return statement outside of your for loop:</p>\n\n<pre><code>function FirstFactorial (num) { \n  var myVar=1;\n  for(var i=1; i&lt;=num; i++){\n    myVar=myVar*i;\n    }\nreturn myVar;\n};\n\nshow(FirstFactorial(5));\n</code></pre>\n"
      },
      {
        owner: {
          reputation: 1673,
          user_id: 1330180,
          user_type: "registered",
          accept_rate: 76,
          profile_image: "https://www.gravatar.com/avatar/2191f177d8fa8b98113039e097964f33?s=128&d=identicon&r=PG",
          display_name: "Dean Meehan",
          link: "https://stackoverflow.com/users/1330180/dean-meehan"
        },
        is_accepted: false,
        score: 3,
        last_activity_date: 1399404242,
        creation_date: 1399404242,
        answer_id: 23503231,
        question_id: 23503166,
        link: "https://stackoverflow.com/questions/23503166/for-loop-in-js-only-returns-first-value/23503231#23503231",
        body: "<p>Your loop actually returns when it first reaches the <code>return</code> and never runs after. This is how return works, returning back to where it was called. You would be better to place your return to run AFTER the loop has completed.</p>\n\n<pre><code>function FirstFactorial (num) { \n  var myVar=1;\n  for(var i=1; i&lt;=num; i++){\n    myVar=myVar*i;\n  }\n  return myVar;\n};\n\nshow(FirstFactorial(5));\n</code></pre>\n\n<p>Here is a <a href=\"http://jsfiddle.net/meehanman/hfSD5/\" rel=\"nofollow\">JSFiddle</a> of the result. </p>\n"
      },
      {
        owner: {
          reputation: 7561,
          user_id: 541404,
          user_type: "registered",
          accept_rate: 98,
          profile_image: "https://www.gravatar.com/avatar/599c7e31296da6999371bd6718b61ef5?s=128&d=identicon&r=PG",
          display_name: "Cameron Tinker",
          link: "https://stackoverflow.com/users/541404/cameron-tinker"
        },
        is_accepted: false,
        score: 2,
        last_activity_date: 1399471334,
        last_edit_date: 1399471334,
        creation_date: 1399405330,
        answer_id: 23503553,
        question_id: 23503166,
        link: "https://stackoverflow.com/questions/23503166/for-loop-in-js-only-returns-first-value/23503553#23503553",
        body: "<p>By using recursion, you can achieve much smaller code and eliminate the need for a <code>for loop</code>:</p>\n\n<pre><code>function factorial(n) { \n    return n &gt; 1 ? n * factorial(n-1) : (n == 0) ? 1 : n;\n}\n\nconsole.log(factorial(5));\n</code></pre>\n\n<p>Returns:</p>\n\n<pre><code>120\n</code></pre>\n\n<p>jsFiddle: <a href=\"http://jsfiddle.net/DuLpr/2/\" rel=\"nofollow\">http://jsfiddle.net/DuLpr/2/</a></p>\n"
      }
    ],
    owner: {
      reputation: 4,
      user_id: 3609630,
      user_type: "registered",
      profile_image: "https://www.gravatar.com/avatar/54adb2af3c636e4e36e945563bc7ab6a?s=128&d=identicon&r=PG&f=1",
      display_name: "user3609630",
      link: "https://stackoverflow.com/users/3609630/user3609630"
    },
    is_answered: true,
    view_count: 1100,
    answer_count: 4,
    score: -1,
    last_activity_date: 1399471334,
    creation_date: 1399404023,
    question_id: 23503166,
    body_markdown: "I&#39;ve created a loop in JS to calculate factorials - however, instead of getting the factorial, I&#39;m just only getting the first value of the for loop.  In the code below, I&#39;m just getting 1 for show(FirstFactorial(5));\r\n\r\nAny ideas on what&#39;s wrong here...?\r\n\r\n    function FirstFactorial (num) { \r\n      var myVar=1;\r\n      for(var i=1; i&lt;=num; i++){\r\n        myVar=myVar*i;\r\n        return myVar;\r\n    }\r\n    };\r\n    \r\n    show(FirstFactorial(5));",
    link: "https://stackoverflow.com/questions/23503166/for-loop-in-js-only-returns-first-value",
    title: "For loop in JS only returns first value?",
    body: "<p>I've created a loop in JS to calculate factorials - however, instead of getting the factorial, I'm just only getting the first value of the for loop.  In the code below, I'm just getting 1 for show(FirstFactorial(5));</p>\n\n<p>Any ideas on what's wrong here...?</p>\n\n<pre><code>function FirstFactorial (num) { \n  var myVar=1;\n  for(var i=1; i&lt;=num; i++){\n    myVar=myVar*i;\n    return myVar;\n}\n};\n\nshow(FirstFactorial(5));\n</code></pre>\n"
  },
    {
      tags: [
        "javascript",
        "html",
        "for-loop",
        "settimeout"
      ],
      answers: [{
        owner: {
          reputation: 116,
          user_id: 4331358,
          user_type: "registered",
          profile_image: "https://i.stack.imgur.com/UgMFF.png?s=128&g=1",
          display_name: "Sameer Ahmad",
          link: "https://stackoverflow.com/users/4331358/sameer-ahmad"
        },
        is_accepted: false,
        score: 1,
        last_activity_date: 1542134225,
        creation_date: 1542134225,
        answer_id: 53287496,
        question_id: 53287359,
        link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js/53287496#53287496",
        body: "<pre><code>var alertEachLetter =function(p1, i){\n    setTimeout(function(){\n        alert(p1.slice(0, i));\n    },1000);\n};\n\n function startFunction() {\n p1 = document.getElementById('p1').innerHTML;\n for (var i=1; i&lt;=p1.length; i++) {\n        alertEachLetter(p1, i);\n    }\n}\n</code></pre>\n\n<p>why create this alertEachLetter function. for that you need to check this link</p>\n\n<p><a href=\"https://stackoverflow.com/questions/5226285/settimeout-in-for-loop-does-not-print-consecutive-values\">setTimeout in for-loop does not print consecutive values</a></p>\n"
      },
        {
          owner: {
            reputation: 4135,
            user_id: 7916438,
            user_type: "registered",
            profile_image: "https://www.gravatar.com/avatar/8541ff62182bcfd172e116a4e0d2fa58?s=128&d=identicon&r=PG",
            display_name: "tevemadar",
            link: "https://stackoverflow.com/users/7916438/tevemadar"
          },
          is_accepted: true,
          score: 1,
          last_activity_date: 1542134270,
          creation_date: 1542134270,
          answer_id: 53287508,
          question_id: 53287359,
          link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js/53287508#53287508",
          body: "<p>You can not and should not delay anything inside a loop, because that is how the nonresponsive pages are made: the browser does not react to user actions or do anything visible until the JavaScript code returns.</p>\n\n<p>Instead, you can use some timer, like <code>setInterval()</code>:</p>\n\n<p><div class=\"snippet\" data-lang=\"js\" data-hide=\"false\" data-console=\"true\" data-babel=\"false\">\r\n<div class=\"snippet-code\">\r\n<pre class=\"snippet-code-js lang-js prettyprint-override\"><code>function startFunction() {\r\n    var p1 = document.getElementById('p1');\r\n    var txt = p1.innerHTML;\r\n    var i=0;\r\n    var timer = setInterval(function() {\r\n        p1.innerHTML = txt.slice(0,i++);\r\n        if(i&gt;txt.length) {\r\n            clearInterval(timer);\r\n        }\r\n    },500);\r\n}\r\n\r\nstartFunction();</code></pre>\r\n<pre class=\"snippet-code-html lang-html prettyprint-override\"><code>&lt;p id=\"p1\"&gt;Hi, I'm&lt;/p&gt;</code></pre>\r\n</div>\r\n</div>\r\n</p>\n"
        },
        {
          owner: {
            reputation: 198,
            user_id: 1335475,
            user_type: "registered",
            profile_image: "https://www.gravatar.com/avatar/77ef4c4df7698aec60571fd46af35cc0?s=128&d=identicon&r=PG",
            display_name: "bluejack",
            link: "https://stackoverflow.com/users/1335475/bluejack"
          },
          is_accepted: false,
          score: 1,
          last_activity_date: 1542134381,
          creation_date: 1542134381,
          answer_id: 53287534,
          question_id: 53287359,
          link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js/53287534#53287534",
          body: "<p>You don't need a loop, you need an <code>interval</code>. Javascript's <code>interval</code> feature will call your function at (approximately) the requested interval. So, for example:</p>\n\n<pre><code>function startFunction() {\n  var p1 = document.getElementById('p1').innerHTML\n  var count = 1\n  var finished = p1.length\n  var iv = setInterval(function() {\n    alert(p1.slice(0,count++))\n    if (count &gt; finished) {\n      clearInterval(iv) // stops the interval from firing once we finish our task\n    }\n  }, 1000) // 1000 ms, or every second.\n}\n</code></pre>\n"
        },
        {
          owner: {
            reputation: 1908,
            user_id: 1771994,
            user_type: "registered",
            accept_rate: 79,
            profile_image: "https://www.gravatar.com/avatar/92bb8a32559190ac0aa783c02c3c0299?s=128&d=identicon&r=PG&f=1",
            display_name: "tommyO",
            link: "https://stackoverflow.com/users/1771994/tommyo"
          },
          is_accepted: false,
          score: 0,
          last_activity_date: 1542135514,
          last_edit_date: 1542135514,
          creation_date: 1542135142,
          answer_id: 53287722,
          question_id: 53287359,
          link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js/53287722#53287722",
          body: "<p>Below is an approach I think may help you achieve what youre trying to do. This approach uses <code>setInterval</code> (instead of a loop) to execute a function multiple times. See the comments to understand the code logic:</p>\n\n<p><div class=\"snippet\" data-lang=\"js\" data-hide=\"false\" data-console=\"true\" data-babel=\"false\">\r\n<div class=\"snippet-code\">\r\n<pre class=\"snippet-code-js lang-js prettyprint-override\"><code>//Grab our DOM elements\r\nvar p1 = document.getElementById('p1').innerHTML;\r\nvar copy = document.getElementById('copy');\r\n\r\n//Execute a function every 250 milliseconds\r\nvar intervalId = setInterval(onInterval, 250);\r\n\r\n//nextLetter is a function that will return the character at a particular index in the string. The function will increase the index each time it is called. The function will return null once it exceeds the innerHTML length. c is a \"private\" variable that can't be modified elsewhere in the program.\r\nvar nextLetter = (function(i, limit) {\r\n  var c = i;\r\n  return function() {\r\n    var idx = c++;\r\n    if (idx &gt; limit) {\r\n      return null;\r\n    }\r\n    return p1.charAt(idx);\r\n  };\r\n})(0, p1.length);\r\n\r\n//The function we will execute at each interval\r\nfunction onInterval() {\r\n  var letter = nextLetter();\r\n  if (letter) {\r\n    copy.innerHTML += letter;\r\n  } else {\r\n    console.log('End of content reached - removing interval');\r\n    clearTimeout(intervalId);\r\n  }\r\n}</code></pre>\r\n<pre class=\"snippet-code-html lang-html prettyprint-override\"><code>&lt;p id=\"p1\"&gt;Make sure to read the in-code comments&lt;/p&gt;\r\n&lt;p id=\"copy\"&gt;&lt;/p&gt;</code></pre>\r\n</div>\r\n</div>\r\n</p>\n"
        },
        {
          owner: {
            reputation: 27209,
            user_id: 1377002,
            user_type: "registered",
            profile_image: "https://i.stack.imgur.com/oDeF7.jpg?s=128&g=1",
            display_name: "Andy",
            link: "https://stackoverflow.com/users/1377002/andy"
          },
          is_accepted: false,
          score: 1,
          last_activity_date: 1542144285,
          last_edit_date: 1542144285,
          creation_date: 1542143797,
          answer_id: 53289607,
          question_id: 53287359,
          link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js/53289607#53289607",
          body: "<p>Here's a quick example using <code>setTimeout</code> instead of <code>setInterval</code>. There's not much difference except you don't have to clear the timeout - you simply don't run it if it doesn't meet a condition.</p>\n\n<p><div class=\"snippet\" data-lang=\"js\" data-hide=\"false\" data-console=\"true\" data-babel=\"false\">\r\n<div class=\"snippet-code\">\r\n<pre class=\"snippet-code-js lang-js prettyprint-override\"><code>// cache the elements\r\nconst p1 = document.getElementById('p1');\r\nconst out = document.getElementById('out');\r\n\r\n// make the text content from p1 iterable and split it into\r\n// the head (first element), and tail (everything else)\r\nconst [head, ...tail] = [...p1.textContent];\r\n\r\nconst loop = function loop(head, tail) {\r\n\r\n  // update the output text content with the result of head\r\n  out.textContent = head;\r\n\r\n  // if there's anything left of the tail array\r\n  if (tail.length) {\r\n\r\n    // remove the first element of tail and\r\n    // add it to head\r\n    head += tail.shift();\r\n\r\n    // call the function again with the new head and tail\r\n    setTimeout(loop, 200, head, tail);\r\n  }\r\n\r\n// pass in the head and tail to the function\r\n}(head, tail);</code></pre>\r\n<pre class=\"snippet-code-css lang-css prettyprint-override\"><code>#p1 { display: none; }</code></pre>\r\n<pre class=\"snippet-code-html lang-html prettyprint-override\"><code>&lt;p id=\"p1\"&gt;Content written letter by letter&lt;/p&gt;\r\n&lt;p id=\"out\"&gt;&lt;/p&gt;</code></pre>\r\n</div>\r\n</div>\r\n</p>\n"
        }
      ],
      owner: {
        reputation: 34,
        user_id: 10333668,
        user_type: "registered",
        profile_image: "https://lh5.googleusercontent.com/-51SIOXz_EZc/AAAAAAAAAAI/AAAAAAAAAAA/APUIFaNBrfp034LZeOGFGEQmtyf6v0_XHg/mo/photo.jpg?sz=128",
        display_name: "B&#225;lint Cs&#233;falvay",
        link: "https://stackoverflow.com/users/10333668/b%c3%a1lint-cs%c3%a9falvay"
      },
      is_answered: true,
      view_count: 55,
      accepted_answer_id: 53287508,
      answer_count: 5,
      score: 0,
      last_activity_date: 1542144285,
      creation_date: 1542133648,
      question_id: 53287359,
      body_markdown: "I wrote this code in JS:\r\n\r\n    function startFunction() {\r\n\tp1 = document.getElementById(&#39;p1&#39;).innerHTML;\r\n\tfor (var i=1; i&lt;=p1.length; i++) {\r\n\t\t\talert(p1.slice(0, i));\r\n\t    }\r\n    }\r\n\r\nI call the function with onload event in html:\r\n\r\n    \t&lt;body onload=&quot;startFunction()&quot;&gt;\r\nAnd thi is the paragraph with *p1* id:\r\n\r\n        &lt;p id=&quot;p1&quot;&gt;Hi, I&#39;m&lt;/p&gt;\r\n\r\nHow can I make a delay for the for loop. I want my program to write the *p1* text letter by letter.\r\n\r\n\r\n",
      link: "https://stackoverflow.com/questions/53287359/timing-for-loop-in-js",
      title: "timing for loop in JS",
      body: "<p>I wrote this code in JS:</p>\n\n<pre><code>function startFunction() {\np1 = document.getElementById('p1').innerHTML;\nfor (var i=1; i&lt;=p1.length; i++) {\n        alert(p1.slice(0, i));\n    }\n}\n</code></pre>\n\n<p>I call the function with onload event in html:</p>\n\n<pre><code>    &lt;body onload=\"startFunction()\"&gt;\n</code></pre>\n\n<p>And thi is the paragraph with <em>p1</em> id:</p>\n\n<pre><code>    &lt;p id=\"p1\"&gt;Hi, I'm&lt;/p&gt;\n</code></pre>\n\n<p>How can I make a delay for the for loop. I want my program to write the <em>p1</em> text letter by letter.</p>\n"
    },
    {
      tags: [
        "javascript",
        "html",
        "css",
        "angularjs"
      ],
      answers: [{
        owner: {
          reputation: 983,
          user_id: 4606706,
          user_type: "registered",
          profile_image: "https://www.gravatar.com/avatar/ad0a0b065d343a734ea5d87d7c2cd66f?s=128&d=identicon&r=PG&f=1",
          display_name: "Tyler",
          link: "https://stackoverflow.com/users/4606706/tyler"
        },
        is_accepted: false,
        score: 1,
        last_activity_date: 1508191383,
        last_edit_date: 1508191383,
        creation_date: 1508184019,
        answer_id: 46778161,
        question_id: 46777485,
        link: "https://stackoverflow.com/questions/46777485/for-loop-in-js-code/46778161#46778161",
        body: "<p>Why not just do all of the hide/show logic in the <code>ng-if</code> i.e.</p>\n\n<p><code>ng-if=\"show == 4 &amp;&amp; $rootScope.detailsList1.length > 0\"</code></p>\n\n<p>This would cause the browser to not render the div unless both of those conditionals are true. </p>\n\n<p>Just some random info about <code>ng-if</code>, <code>ng-show</code> and <code>ng-hide</code> that might be helpful as well.</p>\n\n<p><code>ng-if</code> will only add the html it is wrapped around to the DOM if it is true. If it is false, it removes the html completely. This means you won't be able to access any element in this block if the <code>ng-if</code> is false.</p>\n\n<p><code>ng-show/ng-hide</code> on the other hand will still create the html to be displayed in the DOM, it will just add <code>ng-hide</code> as a class when the element should be hidden. This allows the elements to still be accessed with JavaScript even though they aren't visible.</p>\n\n<hr />\n\n<p>The above was a misunderstanding of the question, I will leave it as it may be helpful when dealing with <code>ng-if</code>, <code>ng-show</code>, and <code>ng-hide</code>. </p>\n\n<p>After playing with your plunker, I was able to get it working, although I think you should definitely clean up your variables. Rather than using <code>$rootScope.detailsList1</code> to keep track of the number of items in your array, you should just use $scope.details.length. It will be a lot cleaner, easier to read, and easier to maintain in the future. Also, I'm not sure if they are bugs or intentional, but you have 3 different lists, all seemingly for the same thing, <code>$rootScope.detailsList1</code>, <code>$scope.details</code>, and <code>$rootScope.detailsList</code>. From just the snippet in plunker, I would assume all 3 of these should reference the same array, and none of it should be on the rootScope. If you need to pass it between controllers you would be better served using a service.</p>\n\n<p>Having said that, to fix your current code base, just add this check to the end of the interval function</p>\n\n<pre><code>$interval(function() {\n\n    if ($scope.show === 4) {\n        if ($rootScope.detailsList &lt;= $rootScope.detailsList1-1) {\n            ++$rootScope.detailsList;\n        } else {\n            $rootScope.detailsList = 0;\n            $scope.show = 1;\n        }\n    }\n    else if ($scope.show &lt; 4) {\n        ++$scope.show; \n    } else {\n        $scope.show = 1;\n    }\n\n    // if the details list is empty and show is 4, skip back to 1\n    if ($rootScope.detailsList === 0 &amp;&amp; $scope.show === 4) {\n        $scope.show = 1;\n    }\n\n}, 5000, 0);\n</code></pre>\n"
      }],
      owner: {
        reputation: 13,
        user_id: 8727958,
        user_type: "registered",
        accept_rate: 20,
        profile_image: "https://www.gravatar.com/avatar/611526060110b9851d2b361c3e296c24?s=128&d=identicon&r=PG&f=1",
        display_name: "user8727958",
        link: "https://stackoverflow.com/users/8727958/user8727958"
      },
      is_answered: true,
      view_count: 72,
      answer_count: 1,
      score: 0,
      last_activity_date: 1508506719,
      creation_date: 1508181043,
      last_edit_date: 1508506719,
      question_id: 46777485,
      body_markdown: "I am loading each div based on certain timeperiod which is defined in js file.\r\nI have 4 div&#39;s. I want to load div 4(ng-if=&quot;show ==4&quot;) only if list size is greater than zero(detailsList1 &gt; 0).Below is the code i have used:\r\n\r\n    &lt;div ng-if=&quot;show ==4&quot; ng-controller=&quot;detailsController&quot; ng-hide=&quot;$rootScope.detailsList1==0&quot;&gt;\r\n          &lt;div ng-repeat=&quot;data in details&quot; id=&quot;{{data.Id}}&quot;&gt;\r\n             &lt;div ng-repeat=&quot;(key, value) in data&quot; id=&quot;{{data.Id}}&quot;&gt;\r\n              {{value}}\r\n             &lt;/div&gt;\r\n         &lt;/div&gt;\r\n      &lt;/div&gt;\r\n\r\nIf the list size is zero it should not wait for the interval to complete, instead skip this div and load another div.\r\n\r\nSample demo:http://plnkr.co/edit/R4yYM522OS3PMIZ5zfzn?p=preview\r\n\r\nAny suggestions on how to skip the $interval if list to load in a particular div is zero",
      link: "https://stackoverflow.com/questions/46777485/for-loop-in-js-code",
      title: "for loop in js code",
      body: "<p>I am loading each div based on certain timeperiod which is defined in js file.\nI have 4 div's. I want to load div 4(ng-if=\"show ==4\") only if list size is greater than zero(detailsList1 > 0).Below is the code i have used:</p>\n\n<pre><code>&lt;div ng-if=\"show ==4\" ng-controller=\"detailsController\" ng-hide=\"$rootScope.detailsList1==0\"&gt;\n      &lt;div ng-repeat=\"data in details\" id=\"{{data.Id}}\"&gt;\n         &lt;div ng-repeat=\"(key, value) in data\" id=\"{{data.Id}}\"&gt;\n          {{value}}\n         &lt;/div&gt;\n     &lt;/div&gt;\n  &lt;/div&gt;\n</code></pre>\n\n<p>If the list size is zero it should not wait for the interval to complete, instead skip this div and load another div.</p>\n\n<p>Sample demo:<a href=\"http://plnkr.co/edit/R4yYM522OS3PMIZ5zfzn?p=preview\" rel=\"nofollow noreferrer\">http://plnkr.co/edit/R4yYM522OS3PMIZ5zfzn?p=preview</a></p>\n\n<p>Any suggestions on how to skip the $interval if list to load in a particular div is zero</p>\n"
    }
  ],
  has_more: true,
  quota_max: 10000,
  quota_remaining: 9970
};

type AnswersAPIResponse = {
  items: Array<{
    owner: {
      reputation: number,
      user_id: number,
      user_type: string,
      profile_image: string,
      display_name: string,
      link: string
    },
    is_accepted: false,
    score: 0,
    last_activity_date: number,
    last_edit_date: number,
    creation_date: number,
    answer_id: number,
    question_id: number,
    body_markdown: string,
    body: string
  }>,
  has_more: boolean,
  quota_max: number,
  quota_remaining: number
};


const test2: Question = {
  entities: {
    intent: {
      value: 'StackOverflow',
    },
    prog_concept: {
      body: 'PHP loop',
      end: 20,
      start: 12,
      suggested: true,
      value: 'PHP loop'
    }
  },
  intent: 'default_intent',
  msg_body: 'how to do a PHP Loop',
  msg_id: 'q24r5ewf9iuhwq8tr4'
};
