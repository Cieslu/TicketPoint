<div align="center">
  
# TicketPoint

</div>

A system for creating tickets 🎫. This application is called TicketPoint, because it serves as the point for resolving user issues. It is a very simple and easy-to-use system that is always accessible to users, who need help with their daily tasks. 📟🎫

## Table Of Contents
1. ##### [Technologies Used](#technologies-used-1)
2. ##### [Database](#database-1)
3. ##### [Application Overview](#application-overview-1)
    1. ##### [All Roles](#all-roles-1)
        1. ##### [Login Page](#login-page-1)
    2. ##### [Administrator Role](#administrator-role-1)
        1. ##### [Home Page](#home-page-1)
        2. ##### [Ticket Details](#tikcet-details)
        3. ##### [Users List](#users-list-1)
        4. ##### [Adding User](#adding-user-1)
        5. ##### [Change User's Password](#change-users-password-1)
        6. ##### [Blocking User](#blocking-user-1)
        7. ##### [Deleting User](#deleting-user-1)
   
# Technologies Used
#### Backend:
- .NET 8.0,
  
- C#,
  
- Entity Framework Core,
  
- MSSQL.
  
#### Frontend:
- Angular 18,
  
- Typescript,
  
- Bootstrap 5.

# Application Overview

## All Roles

### Login Page
> To use the application, log-in is required.
<img src="/TicketPoint_Photos/login.png" alt="login">

## Administrator Role
### Home Page
> The administrator's home page shows all tickets submitted by users. 
<img src="/TicketPoint_Photos/home_page_admin.png" alt="home_page_admin">

> The ticket has few buttons:
> - **Green:** This button is used to mark the selected ticket as read or unread,
> - **Yellow:** This button is used to assign the selected ticket to the logged in administrator,
> - **Blue:** This button is used to mark the selected ticket as open or closed.
<img src="/TicketPoint_Photos/ticket_buttons.png" alt="ticket_buttons">

> The special panel for filtering tickets. The administrator can:
> - enter a few words in the search field and search for any ticket,
> - filter tickets by the branches,
> - view closed tickets,
> - view his tickets.
<div align="center">
<img src="/TicketPoint_Photos/filtering.png" alt="filtering">
</div>

> The image below shows tickets filtered by branches.
<img src="/TicketPoint_Photos/filtering_by_branches.png" alt="filtering_by_branches">

> This is the list of closed tickets. The tikcets can be reopened.
<img src="/TicketPoint_Photos/closed_tickets.png" alt="closed_tickets">

> This image shows the tickets for the logged-in administrator.
<img src="/TicketPoint_Photos/my_tickets.png" alt="my_tickets">

### Tikcet Details
> This page shows the ticket details. There will also be a chat between the administrator and the user.
<img src="/TicketPoint_Photos/ticket_details_with_attachments.png" alt="ticket_details_with_attachments">

### Users List
> This page shows all the users who are registered in the application. The administrator can edit, block, or delete users and change their passwords using special buttons. The filtering panel is also accessible.
<img src="/TicketPoint_Photos/users_list.png" alt="users_list">

### Adding User
> The administrator has the option to add a user. When the 'Administrator' checkbox is checked, the user being created will have the administrator role.
<img src="/TicketPoint_Photos/adding_user.png" alt="adding_user">

### Editing User
> The administrator has the option to edit a user’s details
<img src="/TicketPoint_Photos/editing_user.png" alt="editing_user">

### Change User's Password
> The administrator has the option to change a user's password.
<img src="/TicketPoint_Photos/password_change.png" alt="password_change">

### Blocking User
> The administrator has the option to block a user.
<img src="/TicketPoint_Photos/blocking_user.png" alt="blocking_user">

### Deleting User
> The administrator has the option to delete a user who does not have created any tickets.
<img src="/TicketPoint_Photos/deleting_user_without_tickets.png" alt="deleting_user_without_tickets">









<div align="center">
  
  # The page is still under construction.
  
  <img src="under_construction.png" alt="under_construction">
  
</div>


