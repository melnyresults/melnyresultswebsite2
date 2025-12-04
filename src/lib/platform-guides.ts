type PlatformGuide = {
  name: string;
  icon: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    description?: string;
  }[];
  steps: {
    title: string;
    description: string;
    url?: string;
    substeps?: string[];
  }[];
  notes?: string[];
};

export const platformGuides: Record<string, PlatformGuide> = {
  google_ads: {
    name: 'Google Ads',
    icon: '🎯',
    description: 'Connect your Google Ads account to track and manage campaigns',
    fields: [
      {
        name: 'customer_id',
        label: 'Customer ID',
        type: 'text',
        placeholder: '123-456-7890',
        required: true,
        description: 'Your Google Ads Customer ID (format: XXX-XXX-XXXX)',
      },
      {
        name: 'developer_token',
        label: 'Developer Token',
        type: 'password',
        placeholder: 'Enter your developer token',
        required: true,
      },
      {
        name: 'client_id',
        label: 'OAuth Client ID',
        type: 'text',
        placeholder: 'Enter your OAuth 2.0 Client ID',
        required: true,
      },
      {
        name: 'client_secret',
        label: 'OAuth Client Secret',
        type: 'password',
        placeholder: 'Enter your OAuth 2.0 Client Secret',
        required: true,
      },
      {
        name: 'refresh_token',
        label: 'Refresh Token',
        type: 'password',
        placeholder: 'Enter your refresh token',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Access Google Ads',
        description: 'Log into your Google Ads account',
        url: 'https://ads.google.com/',
      },
      {
        title: 'Get Your Customer ID',
        description: 'Find your Customer ID in the top right corner of your Google Ads dashboard',
        substeps: [
          'Look for the 10-digit number in XXX-XXX-XXXX format',
          'Copy this number without the dashes',
        ],
      },
      {
        title: 'Create a Google Cloud Project',
        description: 'Set up a project in Google Cloud Console',
        url: 'https://console.cloud.google.com/',
        substeps: [
          'Click "Select a project" and then "New Project"',
          'Name your project and click "Create"',
          'Enable the Google Ads API for this project',
        ],
      },
      {
        title: 'Get Developer Token',
        description: 'Apply for a developer token in your Google Ads account',
        url: 'https://ads.google.com/aw/apicenter',
        substeps: [
          'Go to Tools & Settings > API Center',
          'Apply for Basic or Standard access',
          'Wait for approval (test access is instant)',
        ],
      },
      {
        title: 'Create OAuth 2.0 Credentials',
        description: 'Set up OAuth credentials in Google Cloud Console',
        url: 'https://console.cloud.google.com/apis/credentials',
        substeps: [
          'Click "Create Credentials" > "OAuth client ID"',
          'Choose "Web application" as application type',
          'Add authorized redirect URIs',
          'Copy the Client ID and Client Secret',
        ],
      },
      {
        title: 'Generate Refresh Token',
        description: 'Use the OAuth Playground to generate a refresh token',
        url: 'https://developers.google.com/oauthplayground/',
        substeps: [
          'Click the gear icon and check "Use your own OAuth credentials"',
          'Enter your Client ID and Client Secret',
          'Select Google Ads API scope',
          'Authorize and exchange code for tokens',
          'Copy the refresh token',
        ],
      },
    ],
    notes: [
      'Developer token approval can take 1-2 business days for Standard access',
      'Test access allows limited API calls for development',
      'Keep your credentials secure and never share them',
    ],
  },

  meta_ads: {
    name: 'Meta Ads',
    icon: '📘',
    description: 'Connect Meta Ads Manager (Facebook & Instagram Ads)',
    fields: [
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Enter your long-lived access token',
        required: true,
        description: 'Your Meta Marketing API access token',
      },
      {
        name: 'ad_account_id',
        label: 'Ad Account ID',
        type: 'text',
        placeholder: 'act_1234567890',
        required: true,
        description: 'Your Meta Ad Account ID (starts with act_)',
      },
      {
        name: 'app_id',
        label: 'App ID',
        type: 'text',
        placeholder: 'Enter your Facebook App ID',
        required: true,
      },
      {
        name: 'app_secret',
        label: 'App Secret',
        type: 'password',
        placeholder: 'Enter your Facebook App Secret',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Create a Meta App',
        description: 'Set up a new app in Meta for Developers',
        url: 'https://developers.facebook.com/apps/',
        substeps: [
          'Click "Create App"',
          'Select "Business" as the app type',
          'Fill in app details and create',
        ],
      },
      {
        title: 'Add Marketing API',
        description: 'Add the Marketing API product to your app',
        substeps: [
          'In your app dashboard, click "Add Product"',
          'Find "Marketing API" and click "Set Up"',
          'Configure basic settings',
        ],
      },
      {
        title: 'Get App Credentials',
        description: 'Copy your App ID and App Secret',
        substeps: [
          'Go to Settings > Basic in your app dashboard',
          'Copy the App ID',
          'Click "Show" next to App Secret and copy it',
        ],
      },
      {
        title: 'Generate Access Token',
        description: 'Create a long-lived access token',
        url: 'https://developers.facebook.com/tools/explorer/',
        substeps: [
          'Select your app from the dropdown',
          'Click "Generate Access Token"',
          'Grant all required permissions (ads_read, ads_management)',
          'Exchange short-lived token for long-lived token using Token Debugger',
        ],
      },
      {
        title: 'Get Ad Account ID',
        description: 'Find your Ad Account ID',
        url: 'https://business.facebook.com/settings/ad-accounts/',
        substeps: [
          'Go to Business Settings > Ad Accounts',
          'Click on your ad account',
          'Copy the Account ID (format: act_XXXXXXXX)',
        ],
      },
    ],
    notes: [
      'Access tokens expire after 60 days by default',
      'Your app must be in Live mode for production use',
      'Request advanced access for higher API rate limits',
    ],
  },

  google_analytics: {
    name: 'Google Analytics',
    icon: '📊',
    description: 'Connect Google Analytics to track website performance',
    fields: [
      {
        name: 'property_id',
        label: 'Property ID',
        type: 'text',
        placeholder: 'G-XXXXXXXXXX or UA-XXXXXXXXX',
        required: true,
        description: 'Your GA4 Property ID or Universal Analytics ID',
      },
      {
        name: 'client_email',
        label: 'Service Account Email',
        type: 'email',
        placeholder: 'your-service-account@project.iam.gserviceaccount.com',
        required: true,
      },
      {
        name: 'private_key',
        label: 'Private Key',
        type: 'textarea',
        placeholder: 'Paste your service account private key (JSON)',
        required: true,
        description: 'Private key from your service account JSON file',
      },
    ],
    steps: [
      {
        title: 'Access Google Analytics',
        description: 'Log into your Google Analytics account',
        url: 'https://analytics.google.com/',
      },
      {
        title: 'Get Property ID',
        description: 'Find your GA4 Property ID',
        substeps: [
          'Go to Admin (gear icon in bottom left)',
          'Select your Property',
          'Click "Property Settings"',
          'Copy the Property ID (format: G-XXXXXXXXXX)',
        ],
      },
      {
        title: 'Create Service Account',
        description: 'Set up a service account in Google Cloud Console',
        url: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
        substeps: [
          'Click "Create Service Account"',
          'Enter name and description',
          'Click "Create and Continue"',
          'Grant "Viewer" role',
          'Click "Done"',
        ],
      },
      {
        title: 'Generate Service Account Key',
        description: 'Create and download the JSON key file',
        substeps: [
          'Click on the service account you created',
          'Go to "Keys" tab',
          'Click "Add Key" > "Create new key"',
          'Select "JSON" and click "Create"',
          'Save the downloaded JSON file securely',
        ],
      },
      {
        title: 'Grant Analytics Access',
        description: 'Add service account to your Google Analytics property',
        url: 'https://analytics.google.com/',
        substeps: [
          'Go to Admin > Property Access Management',
          'Click the "+" icon to add users',
          'Enter the service account email address',
          'Select "Viewer" role',
          'Click "Add"',
        ],
      },
      {
        title: 'Enable Analytics API',
        description: 'Enable the Google Analytics Data API',
        url: 'https://console.cloud.google.com/apis/library',
        substeps: [
          'Search for "Google Analytics Data API"',
          'Click on it and press "Enable"',
          'Wait for API to be enabled',
        ],
      },
    ],
    notes: [
      'Use GA4 properties for the latest features',
      'Service account must have Viewer access minimum',
      'Keep your private key file secure',
    ],
  },

  youtube: {
    name: 'YouTube',
    icon: '📺',
    description: 'Connect YouTube to manage your channel and analytics',
    fields: [
      {
        name: 'channel_id',
        label: 'Channel ID',
        type: 'text',
        placeholder: 'UC1234567890',
        required: true,
        description: 'Your YouTube Channel ID (starts with UC)',
      },
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'Enter your YouTube Data API key',
        required: true,
      },
      {
        name: 'oauth_client_id',
        label: 'OAuth Client ID',
        type: 'text',
        placeholder: 'Enter OAuth 2.0 Client ID',
        required: false,
        description: 'Required for managing channel content',
      },
      {
        name: 'oauth_client_secret',
        label: 'OAuth Client Secret',
        type: 'password',
        placeholder: 'Enter OAuth 2.0 Client Secret',
        required: false,
      },
    ],
    steps: [
      {
        title: 'Get Your Channel ID',
        description: 'Find your YouTube Channel ID',
        url: 'https://www.youtube.com/account_advanced',
        substeps: [
          'Go to YouTube Studio',
          'Click Settings > Channel > Advanced settings',
          'Copy your Channel ID',
        ],
      },
      {
        title: 'Create Google Cloud Project',
        description: 'Set up a project in Google Cloud Console',
        url: 'https://console.cloud.google.com/',
        substeps: [
          'Create a new project or select existing',
          'Enable billing for the project (free tier available)',
        ],
      },
      {
        title: 'Enable YouTube Data API',
        description: 'Activate the YouTube Data API v3',
        url: 'https://console.cloud.google.com/apis/library',
        substeps: [
          'Search for "YouTube Data API v3"',
          'Click on it and press "Enable"',
        ],
      },
      {
        title: 'Create API Key',
        description: 'Generate an API key for read-only access',
        url: 'https://console.cloud.google.com/apis/credentials',
        substeps: [
          'Click "Create Credentials" > "API key"',
          'Copy the generated API key',
          'Optionally restrict the key to YouTube Data API only',
        ],
      },
      {
        title: 'Setup OAuth (Optional)',
        description: 'Required for managing channel content',
        substeps: [
          'Click "Create Credentials" > "OAuth client ID"',
          'Select "Web application"',
          'Add authorized redirect URIs',
          'Copy Client ID and Client Secret',
        ],
      },
    ],
    notes: [
      'API Key is sufficient for viewing public data',
      'OAuth is required for managing your channel',
      'YouTube API has daily quota limits',
    ],
  },

  instagram: {
    name: 'Instagram',
    icon: '📸',
    description: 'Connect Instagram Business Account',
    fields: [
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Enter your long-lived access token',
        required: true,
      },
      {
        name: 'instagram_account_id',
        label: 'Instagram Account ID',
        type: 'text',
        placeholder: 'Enter your Instagram Business Account ID',
        required: true,
      },
      {
        name: 'facebook_page_id',
        label: 'Facebook Page ID',
        type: 'text',
        placeholder: 'Enter connected Facebook Page ID',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Convert to Business Account',
        description: 'Switch to Instagram Business or Creator account',
        substeps: [
          'Open Instagram app',
          'Go to Settings > Account',
          'Tap "Switch to Professional Account"',
          'Choose Business or Creator',
        ],
      },
      {
        title: 'Connect to Facebook Page',
        description: 'Link your Instagram to a Facebook Page',
        substeps: [
          'Go to Instagram Settings',
          'Tap "Account" > "Linked Accounts"',
          'Select "Facebook" and connect your page',
          'You must be an admin of the Facebook Page',
        ],
      },
      {
        title: 'Create Facebook App',
        description: 'Set up a Facebook app for Instagram',
        url: 'https://developers.facebook.com/apps/',
        substeps: [
          'Create a new app or use existing',
          'Add "Instagram Basic Display" or "Instagram Graph API"',
          'Configure basic settings',
        ],
      },
      {
        title: 'Get Access Token',
        description: 'Generate a long-lived access token',
        url: 'https://developers.facebook.com/tools/explorer/',
        substeps: [
          'Use Graph API Explorer',
          'Select your app and get user token',
          'Add permissions: instagram_basic, pages_show_list',
          'Generate and exchange for long-lived token',
        ],
      },
      {
        title: 'Get Instagram Account ID',
        description: 'Find your Instagram Business Account ID',
        substeps: [
          'Use Graph API Explorer',
          'Query: me/accounts to get Facebook Page ID',
          'Query: {page-id}?fields=instagram_business_account',
          'Copy the Instagram Business Account ID',
        ],
      },
    ],
    notes: [
      'Must be a Business or Creator account',
      'Requires connection to a Facebook Page',
      'Personal accounts cannot use Instagram API',
    ],
  },

  facebook: {
    name: 'Facebook',
    icon: '👥',
    description: 'Connect Facebook Page for social media management',
    fields: [
      {
        name: 'access_token',
        label: 'Page Access Token',
        type: 'password',
        placeholder: 'Enter your page access token',
        required: true,
      },
      {
        name: 'page_id',
        label: 'Page ID',
        type: 'text',
        placeholder: 'Enter your Facebook Page ID',
        required: true,
      },
      {
        name: 'app_id',
        label: 'App ID',
        type: 'text',
        placeholder: 'Enter Facebook App ID',
        required: true,
      },
      {
        name: 'app_secret',
        label: 'App Secret',
        type: 'password',
        placeholder: 'Enter Facebook App Secret',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Get Your Page ID',
        description: 'Find your Facebook Page ID',
        url: 'https://www.facebook.com/pages/',
        substeps: [
          'Go to your Facebook Page',
          'Click "About" in the left menu',
          'Scroll down to find your Page ID',
          'Or check the URL: facebook.com/[page-id]',
        ],
      },
      {
        title: 'Create Facebook App',
        description: 'Set up a Facebook app',
        url: 'https://developers.facebook.com/apps/',
        substeps: [
          'Click "Create App"',
          'Select app type (Business, Consumer, etc.)',
          'Fill in app details',
          'Complete security check',
        ],
      },
      {
        title: 'Get App Credentials',
        description: 'Copy your App ID and Secret',
        substeps: [
          'Go to App Dashboard > Settings > Basic',
          'Copy the App ID',
          'Show and copy App Secret',
        ],
      },
      {
        title: 'Add Facebook Login',
        description: 'Enable Facebook Login product',
        substeps: [
          'In app dashboard, click "Add Product"',
          'Select "Facebook Login" and set it up',
          'Configure OAuth redirect URIs',
        ],
      },
      {
        title: 'Generate Page Token',
        description: 'Get a Page Access Token',
        url: 'https://developers.facebook.com/tools/explorer/',
        substeps: [
          'Open Graph API Explorer',
          'Select your app',
          'Get User Access Token with pages_manage_posts permission',
          'Query: me/accounts to get Page Access Token',
          'Copy the access_token for your page',
        ],
      },
      {
        title: 'Extend Token Lifetime',
        description: 'Make your token long-lived',
        url: 'https://developers.facebook.com/tools/debug/accesstoken/',
        substeps: [
          'Use Access Token Debugger',
          'Click "Extend Access Token"',
          'Copy the new long-lived token',
        ],
      },
    ],
    notes: [
      'Must be an admin of the Facebook Page',
      'Page tokens can be made to never expire',
      'Request advanced permissions for full features',
    ],
  },

  google_my_business: {
    name: 'Google My Business',
    icon: '📍',
    description: 'Connect Google Business Profile',
    fields: [
      {
        name: 'location_id',
        label: 'Location ID',
        type: 'text',
        placeholder: 'Enter your business location ID',
        required: true,
      },
      {
        name: 'client_email',
        label: 'Service Account Email',
        type: 'email',
        placeholder: 'service-account@project.iam.gserviceaccount.com',
        required: true,
      },
      {
        name: 'private_key',
        label: 'Private Key',
        type: 'textarea',
        placeholder: 'Paste service account private key',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Access Google Business Profile',
        description: 'Log into your business account',
        url: 'https://business.google.com/',
      },
      {
        title: 'Create Google Cloud Project',
        description: 'Set up a new project',
        url: 'https://console.cloud.google.com/',
        substeps: [
          'Create new project',
          'Name it appropriately',
        ],
      },
      {
        title: 'Enable Business Profile API',
        description: 'Activate the Google My Business API',
        url: 'https://console.cloud.google.com/apis/library',
        substeps: [
          'Search for "Google My Business API"',
          'Click and enable the API',
        ],
      },
      {
        title: 'Create Service Account',
        description: 'Set up service account',
        url: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
        substeps: [
          'Click "Create Service Account"',
          'Enter name and description',
          'Grant necessary permissions',
          'Create and download JSON key',
        ],
      },
      {
        title: 'Add User to Business Profile',
        description: 'Grant access to service account',
        url: 'https://business.google.com/',
        substeps: [
          'Go to your business profile',
          'Click "Users" in settings',
          'Add service account email as manager',
        ],
      },
      {
        title: 'Get Location ID',
        description: 'Find your business location ID',
        substeps: [
          'Use Google My Business API to list accounts',
          'Query accounts/{accountId}/locations',
          'Copy your location ID from the response',
        ],
      },
    ],
    notes: [
      'Verify your business before using API',
      'Service account needs Manager access',
      'API has rate limits and quotas',
    ],
  },

  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    description: 'Connect TikTok Business Account',
    fields: [
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Enter your TikTok access token',
        required: true,
      },
      {
        name: 'advertiser_id',
        label: 'Advertiser ID',
        type: 'text',
        placeholder: 'Enter your TikTok Advertiser ID',
        required: true,
      },
      {
        name: 'app_id',
        label: 'App ID',
        type: 'text',
        placeholder: 'Enter TikTok App ID',
        required: true,
      },
      {
        name: 'app_secret',
        label: 'App Secret',
        type: 'password',
        placeholder: 'Enter TikTok App Secret',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Create TikTok Business Account',
        description: 'Sign up for TikTok for Business',
        url: 'https://business.tiktok.com/',
        substeps: [
          'Create business account',
          'Complete business verification',
          'Set up your business profile',
        ],
      },
      {
        title: 'Register for TikTok Developer',
        description: 'Apply for developer access',
        url: 'https://developers.tiktok.com/',
        substeps: [
          'Sign up with your business account',
          'Complete developer registration',
          'Wait for approval (1-3 business days)',
        ],
      },
      {
        title: 'Create an App',
        description: 'Create a new TikTok app',
        substeps: [
          'Go to TikTok Developer Portal',
          'Click "Create App"',
          'Fill in app details',
          'Select required permissions',
        ],
      },
      {
        title: 'Get App Credentials',
        description: 'Copy your app credentials',
        substeps: [
          'Go to your app dashboard',
          'Copy App ID',
          'Copy App Secret',
        ],
      },
      {
        title: 'Get Advertiser ID',
        description: 'Find your TikTok Ads Advertiser ID',
        url: 'https://ads.tiktok.com/',
        substeps: [
          'Log into TikTok Ads Manager',
          'Click on your profile icon',
          'Go to Settings > Account',
          'Copy your Advertiser ID',
        ],
      },
      {
        title: 'Generate Access Token',
        description: 'Obtain OAuth access token',
        substeps: [
          'Use TikTok OAuth flow',
          'Request user authorization',
          'Exchange authorization code for access token',
          'Store the access token securely',
        ],
      },
    ],
    notes: [
      'Requires TikTok Business Account',
      'Developer approval takes 1-3 business days',
      'Access tokens expire and need refresh',
    ],
  },

  pinterest: {
    name: 'Pinterest',
    icon: '📌',
    description: 'Connect Pinterest Business Account',
    fields: [
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Enter your Pinterest access token',
        required: true,
      },
      {
        name: 'app_id',
        label: 'App ID',
        type: 'text',
        placeholder: 'Enter Pinterest App ID',
        required: true,
      },
      {
        name: 'app_secret',
        label: 'App Secret',
        type: 'password',
        placeholder: 'Enter Pinterest App Secret',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Convert to Business Account',
        description: 'Upgrade to Pinterest Business',
        url: 'https://www.pinterest.com/business/create/',
        substeps: [
          'Go to Pinterest Business',
          'Click "Join as a Business"',
          'Complete business profile',
        ],
      },
      {
        title: 'Create Pinterest App',
        description: 'Register a new app',
        url: 'https://developers.pinterest.com/apps/',
        substeps: [
          'Go to Pinterest Developers',
          'Click "Create App"',
          'Fill in app information',
          'Agree to terms and create',
        ],
      },
      {
        title: 'Get App Credentials',
        description: 'Copy your app credentials',
        substeps: [
          'Go to your app dashboard',
          'Copy App ID',
          'Copy App Secret',
          'Note your Redirect URI',
        ],
      },
      {
        title: 'Request API Access',
        description: 'Apply for API access',
        substeps: [
          'In app dashboard, click "Request Access"',
          'Fill out access request form',
          'Describe your use case',
          'Wait for approval',
        ],
      },
      {
        title: 'Generate Access Token',
        description: 'Create OAuth access token',
        substeps: [
          'Use Pinterest OAuth flow',
          'Request required scopes (ads:read, pins:read, etc.)',
          'Get authorization code',
          'Exchange for access token',
        ],
      },
    ],
    notes: [
      'Must have Pinterest Business Account',
      'API access requires approval',
      'Different scopes for different permissions',
    ],
  },

  reddit: {
    name: 'Reddit',
    icon: '🤖',
    description: 'Connect Reddit Account for monitoring and posting',
    fields: [
      {
        name: 'client_id',
        label: 'Client ID',
        type: 'text',
        placeholder: 'Enter Reddit App Client ID',
        required: true,
      },
      {
        name: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'Enter Reddit App Client Secret',
        required: true,
      },
      {
        name: 'username',
        label: 'Reddit Username',
        type: 'text',
        placeholder: 'Enter your Reddit username',
        required: true,
      },
      {
        name: 'password',
        label: 'Reddit Password',
        type: 'password',
        placeholder: 'Enter your Reddit password',
        required: true,
      },
    ],
    steps: [
      {
        title: 'Create Reddit Account',
        description: 'Sign up or log into Reddit',
        url: 'https://www.reddit.com/',
      },
      {
        title: 'Create Reddit App',
        description: 'Register a new application',
        url: 'https://www.reddit.com/prefs/apps/',
        substeps: [
          'Scroll to bottom and click "create another app"',
          'Choose "script" for personal use or "web app" for web apps',
          'Fill in name, description, and redirect URI',
          'Click "create app"',
        ],
      },
      {
        title: 'Get App Credentials',
        description: 'Copy your app credentials',
        substeps: [
          'Under your app name, find the Client ID (random string)',
          'Copy the secret (labeled as "secret")',
          'Keep these credentials secure',
        ],
      },
      {
        title: 'Note Your Username & Password',
        description: 'You will need your Reddit account credentials',
        substeps: [
          'Use the username you created the app with',
          'Use your Reddit account password',
          'Consider enabling 2FA for security',
        ],
      },
      {
        title: 'Test API Access',
        description: 'Verify your credentials work',
        substeps: [
          'Use OAuth2 to get access token',
          'Make a test API call',
          'Confirm successful response',
        ],
      },
    ],
    notes: [
      'Script apps are for personal use only',
      'Rate limits: 60 requests per minute',
      'Follow Reddit API terms of service',
      'Enable 2FA for better security',
    ],
  },
};
