TL;DR
A glorified to-do-list application and an attempt to recreate some of the trello features, key features are: register, login, creating dashboards, creating lists, creating cards, drag and drop, deleting lists,cards,dashboards, editing them and so on. Read further if you want a more in-depth explanation.

---

Intro: Hey, welcome to my failed attempt at recreating Trello or is it? I don't think the odds are high for anyone to recreate trello pixel-perfectly, but the idea is to at least look at some key functionalities and try to understand how to re-create them.

---

Features:

1. Register:

![register functionality](/public/gifs/RegisterGifs/Register.gif)

Let's talk about the register functionality. It looks all good, right? We type in unique information, send it to our server and we get a response back and then redirect to a log-in page, but there is a catch.

![register functionality](/public/gifs/RegisterGifs/RegisterBadRouting.gif)

See what happens when we press enter?
![register functionality](/public/gifs/RegisterGifs/RegisterValidation.gif)

Since the project was using react, in fact, the project was also using react-router as well. At the time I was not really aware of a Link component, so I was still using old-fashioned anchor tag with href property, though, in some of the other pages we will see that I was actually using Link component, there will be some inconsistencies in this project with routing, but, hey, nobody is perfect :), however, we're only inserting correct details, what about if we use incorrect ones, is there any validation?

Oh. There is. So what is actually going on? Well, I was using a simple div

```
{error ? <div className={classes.error}>{error}</div> : null}
```

and stored error message in a state with react-hooks.

````
const [error, seterror] = useState('')```
````

How does the handler look like?

```
const userSubmitHandler = (event) => {
    event.preventDefault()
    const copyProfile = { ...profile }
    delete copyProfile.rpassword
    if (
      profile.userName &&
      profile.email &&
      profile.password &&
      profile.rpassword
    ) {
      if (profile.password === profile.rpassword) {
        fetch(
          'https://copytrelloapi.herokuapp.com/trello/trellouser/register',
          {
            method: 'POST',
            body: JSON.stringify(copyProfile),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((header) => {
            return header.json()
          })
          .then((response) => {
            if (response.error) {
              seterror(response.msg)
            } else {
              window.location.href = `/login`
            }
          })
          .catch((e) => {})
      } else {
        seterror('Wrong repeated password')
      }
    } else {
      seterror('Please fill the empty fields.')
    }
  }
```

Ahh there it is

```
window.location.href = `/login`
```

This is the most react way to route things hehe.

In conclusion I was using validation to check for the correct email format and whether the password matches the repeated password on front end, but whether an email is already in use or the password is correct, I was checking it on backend. Displayed an error message based on the missing information, the routing is bad.

---

2. Login
   ![login functionality](/public/gifs/LoginGifs/Login.gif)

I'm not gonna bore you too much with this section, because it's very similar to register.

We have logout button when we're redirected to dashboards page
![login functionality](/public/gifs/LoginGifs/Logout.gif)
And we also have validation
![login functionality](/public/gifs/LoginGifs/LoginValidation.gif)
However I found an interesting thing in the code

```
{/* {user ? <Redirect to='/' /> : null} */}
```

I was aware of react-router's Redirect component, but for some reason I did not use it? Weird and of course I found my old friend

```
window.location.href = `/`
```

In conclusion, to store the login information I was using JWT and stored it in localstorage to determine whether the user's current session is valid or not, I was also using validation to check if the data is correct or not and of course bad routing, even though I have the correct routing commented.

---

3. Dashboards page

![dashboard screenshot](/public/images/DashboardImgs/dashboard.png)
Here we are greeted by this beautiful dashboards page. The whole purpose of this page is to... _drum rolls_ create dashboards! I did not think through this page that much, because it does not even have delete, edit or move dashboards around functionalities, just create them.

![dashboard screenshot](/public/gifs/DashBoardsGifs/dashboard.gif)

Here I was using a button which opens up a modal. A few good things and a few bad things. I liked the fact I used opacity to make the background more blur and transparent, so we can still see what's happening in the background, while focusing more on the modal. Moving on to a few mistakes I've made. Firstly, I don't like that the modal is not centered and it is very small. Those are small things, but user experience is key in every application. Small things matter a lot.
Secondly, when we press enter
![dashboard screenshot](/public/gifs/DashBoardsGifs/ModalOnSUbmit.gif)
the modal does not disappear, which can be annoying for users.

Thirdly, what happens if we create duplicate boards?
![dashboard screenshot](/public/gifs/DashBoardsGifs/dashDuplicates.gif)
Oh no...

Lastly, what if.. we create a lot of dashboards? Will it wrap?
![dashboard screenshot](/public/gifs/DashBoardsGifs/workingAsIntended.gif)

Ah yes working as intended!:)

and the fix for that would be...

![dashboard screenshot](/public/gifs/DashBoardsGifs/dashWrapFix.gif)

one single CSS line.

Oh I almost forgot..

![dashboard link](/public/gifs/DashBoardsGifs/fixedRouting.gif)

```
<Link to={`/dashboard/${dashboard.dashboardName}`}>
            <div className={classes.dashboard} key={dashboardIndex}>
              <h1 className={classes.dashTitle}>{dashboard.dashboardName}</h1>
            </div>
          </Link>
```

There's also an elephant in this room... _drum rolls_ yeah the key. Index is not the best for map keys, but atleast it never changes, so it "technically" fits here, since we don't have the ability to delete dashboards.

In conclusion, a lot of small oversights, which leads up to clunky user experience and small issues do add up and they're usually easy to fix, but that's really the difference between a rushed and a well polished project.

---

4. The lists/cards the bread and butter of the project

Let's talk about the lists, since cards have the same functionality as lists anyways.

![dashboard link](/public/gifs/ListsGifs/lists.gif)

Here we can create, edit and also delete a list.
This part is kind of not that interesting, because it's just a glorified to-do-list if it only has these 3 functionalities.

What I really cared about is how the drag and drop functionality works.

![dashboard link](/public/gifs/ListsGifs/dragNDrop.gif)

Every element has a property called "draggable", when we use that property, we get access to 5 additional event listeners:

```
onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragStart={(e) => handleDragStart(e, index)}
```

the only ones we really care about are onDrop, onDragStart, but we still have to use all 5 of them to cancel the other 3 behaviour.

Let's start with onDragStart

```
const handleDragStart = (e, index) => {
    e.stopPropagation()
    const listObj = { ...props.list }
    props.setstartListIndex(props.listIndex)
    props.setstartCardIndex(index)
  }
```

The whole purpose of this event and the handler itself is to detect our start and store it into a state.

We're not gonna discuss what's going on too much here, but the whole purpose is to just cancel and not allow these events to fire.

```
const handleDragEnter = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragLeave = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }
```

And the last one is the drop handling

```
const handleDrop = async (e, index) => {
    e.stopPropagation()
    const dashClone = { ...props.dash.dash }
    const testObj = [...props.lists]

    const card = testObj[props.startListIndex].cards[props.startCardIndex]

    testObj[props.startListIndex].cards.splice(props.startCardIndex, 1)
    testObj[props.listIndex].cards.splice(index, 0, card)

    dashClone.lists = testObj
    props.setlists(testObj)

    const response = await fetch(
      `https://copytrelloapi.herokuapp.com/trello/trellodash/editdash/${props.dash.dash._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashClone),
      }
    )
  }
```

What I'm doing here is removing either the dragged card from previous list into the list I dropped, or just switching the positions of the lists. And then sending the data to the backend while also updating the state.

This is it. This is the project pretty much. The main takeaway for me looking back at my older projects is probably pay attention to small details, because they really matter. Also create projects with a purpose. Purpose to learn something new. Had I not tried implementing drag and drop, I would not have learned anything new at all. Nowadays I try to look at various different existing applications and wonder how something was made, could I try to replicate these functionalities?
