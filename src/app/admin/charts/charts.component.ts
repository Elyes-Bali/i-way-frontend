import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';

import { UserDetails } from 'src/app/models/user.model';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/posts/post.service';
import { ChartData, ChartOptions } from 'chart.js'; // Import necessary types
import { UserRole } from 'src/app/models/user-role.enum';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  appointments: Appointment[] = [];
  allUsers: UserDetails[] = [];
  posts: any[] = [];
  totalUsers: number = 0;
  totalAppointments: number = 0;
  totalPosts: number = 0;
  // Chart data and options
  appointmentChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Accepted Appointments',
        backgroundColor: '#4CAF50', // Green
      },
      {
        data: [],
        label: 'Rejected Appointments',
        backgroundColor: '#F44336', // Red
      },
    ],
  };

  postChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Number of Posts per Author',
        backgroundColor: '#2196F3', // Blue
      },
    ],
  };

  userChartData: ChartData = {
    labels: ['Doctors', 'Patients', 'Admins'], // Static roles for users
    datasets: [
      {
        data: [],
        label: 'User Distribution',
        backgroundColor: ['#FFEB3B', '#00BCD4', '#9C27B0'], // Yellow, Cyan, Purple
      },
    ],
  };

  // Chart options
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  constructor(
    private appointmentService: AppointmentsService,
    private authService: AuthService,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllAppointments();
    this.getAllUsers();
    this.loadPosts();
  }

  fetchAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.appointments = data;
        this.totalAppointments = this.appointments.length;
        this.prepareAppointmentData();

        console.log('Fetched appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  getAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data) => {
        this.allUsers = data;
        this.totalUsers = this.allUsers.length;
        this.prepareUserData();

        console.log('All users:', this.allUsers);
      },
      (error) => {
        console.error('Failed to retrieve users:', error);
      }
    );
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.totalPosts = this.posts.length;
      this.preparePostData();
      console.log('Loaded posts:', this.posts);
    });
  }

  // Prepare Appointment Data for the Chart
  prepareAppointmentData(): void {
    const appointmentCounts: {
      [key: string]: { accepted: number; rejected: number };
    } = {};

    this.appointments.forEach((appointment) => {
      const day = appointment.date;
      if (!appointmentCounts[day]) {
        appointmentCounts[day] = { accepted: 0, rejected: 0 };
      }

      // Check appointment status
      if (appointment.status === 'ACCEPTED') {
        appointmentCounts[day].accepted++;
      } else if (appointment.status === 'REJECTED') {
        appointmentCounts[day].rejected++;
      }
    });

    // Prepare chart labels and data
    this.appointmentChartData.labels = Object.keys(appointmentCounts);
    this.appointmentChartData.datasets[0].data = Object.values(
      appointmentCounts
    ).map((item) => item.accepted);
    this.appointmentChartData.datasets[1].data = Object.values(
      appointmentCounts
    ).map((item) => item.rejected);
  }

  // Prepare Post Data for the Chart
  // Prepare Post Data for the Chart with dynamic colors for each author
  preparePostData(): void {
    const postCounts: { [key: string]: number } = {};
    const authorColors: { [key: string]: string } = {}; // Store colors for each author

    // Define a list of colors (you can expand or modify this list)
    const colorList = [
      '#2196F3',
      '#4CAF50',
      '#FFEB3B',
      '#F44336',
      '#9C27B0',
      '#00BCD4',
      '#FF5722',
      '#8BC34A',
    ];

    let colorIndex = 0;

    this.posts.forEach((post) => {
      const author = post.author;
      if (!postCounts[author]) {
        postCounts[author] = 0;
        // Assign a color for each new author
        authorColors[author] = colorList[colorIndex % colorList.length];
        colorIndex++;
      }
      postCounts[author]++;
    });

    // Prepare chart labels and data
    this.postChartData.labels = Object.keys(postCounts);
    this.postChartData.datasets[0].data = Object.values(postCounts);

    // Assign colors to each author's data point in the dataset
    this.postChartData.datasets[0].backgroundColor = Object.keys(
      postCounts
    ).map((author) => authorColors[author]);

    // Log the color mappings for debugging
    console.log('Post Author Colors:', authorColors);
  }

  // Prepare User Data for the Chart
  // Prepare User Data for the Chart
  prepareUserData(): void {
    // Initialize roles count
    const rolesCount: { [key: string]: number } = {
      Doctor: 0,
      Patient: 0,
      Pharmacy: 0,
    };

    // Count the users per role
    this.allUsers.forEach((user) => {
      if (user.role === UserRole.DOCTOR) {
        rolesCount['Doctor']++;
      } else if (user.role === UserRole.PATIENT) {
        rolesCount['Patient']++;
      }
      else if (user.role === UserRole.PHARMACY) {
        rolesCount['Pharmacy']++;
      }
    });

    // Log for debugging
    console.log('Roles Count:', rolesCount);

    // Prepare chart labels and data
    this.userChartData.labels = Object.keys(rolesCount); // Set the labels
    this.userChartData.datasets[0].data = Object.values(rolesCount); // Set the data

    // Force change detection
    this.cdr.detectChanges();

    // Log the updated chart data
    console.log('User Chart Data:', this.userChartData);
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [{ title: 'Meeting', start: new Date() }],
  };

  appointmentCompletionChartData: ChartData = {
    labels: ['Completed (Accepted)', 'Not Completed (Rejected/Pending)'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#F44336'], // Green for completed, Red for not completed
      },
    ],
  };
}
