import { toast } from "react-toastify";

class ProfileService {
  constructor() {
    this.profiles = [];
    this.nextId = 1;
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async parseFile(file) {
    await this.delay(500);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const lines = text.split("\n");
          
          if (lines.length < 2) {
            throw new Error("File must contain at least a header row and one data row");
          }
          
          const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
          const profiles = [];
          
          // Check for required columns
          const requiredColumns = ["firstname", "lastname", "organization", "linkedin_url"];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
          }
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(",").map(v => v.trim());
            const profile = {
              Id: this.nextId++,
              firstname: values[headers.indexOf("firstname")] || "",
              lastname: values[headers.indexOf("lastname")] || "",
              organization: values[headers.indexOf("organization")] || "",
              linkedinUrl: values[headers.indexOf("linkedin_url")] || "",
              verificationStatus: null,
              verifiedAt: null,
              notes: null
            };
            
            // Validate required fields
            if (profile.firstname && profile.lastname && profile.linkedinUrl) {
              profiles.push(profile);
            }
          }
          
          if (profiles.length === 0) {
            throw new Error("No valid profiles found in the file");
          }
          
          this.profiles = profiles;
          toast.success(`Successfully loaded ${profiles.length} profiles`);
          resolve(profiles);
          
        } catch (error) {
          toast.error(`Error parsing file: ${error.message}`);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error("Error reading file");
        toast.error(error.message);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  async getAll() {
    await this.delay(200);
    return [...this.profiles];
  }

  async getById(id) {
    await this.delay(200);
    const profile = this.profiles.find(p => p.Id === parseInt(id));
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return { ...profile };
  }

  async update(id, data) {
    await this.delay(200);
    const index = this.profiles.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    
    this.profiles[index] = {
      ...this.profiles[index],
      ...data,
      verifiedAt: new Date().toISOString()
    };
    
    return { ...this.profiles[index] };
  }

  async updateVerificationStatus(id, status) {
    const updatedProfile = await this.update(id, {
      verificationStatus: status,
      verifiedAt: new Date().toISOString()
    });
    
    const statusText = status === "yes" ? "Match" : "No Match";
    toast.success(`Profile marked as: ${statusText}`);
    
    return updatedProfile;
  }

  async exportToCsv() {
    await this.delay(300);
    
    const headers = ["firstname", "lastname", "organization", "linkedin_url", "verification_status", "verified_at"];
    const csvContent = [
      headers.join(","),
      ...this.profiles.map(profile => [
        profile.firstname,
        profile.lastname,
        profile.organization,
        profile.linkedinUrl,
        profile.verificationStatus || "pending",
        profile.verifiedAt || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `profile_verification_results_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Results exported successfully!");
    return true;
  }

  async getVerificationStats() {
    await this.delay(100);
    
    const total = this.profiles.length;
    const verified = this.profiles.filter(p => p.verificationStatus).length;
    const matches = this.profiles.filter(p => p.verificationStatus === "yes").length;
    const noMatches = this.profiles.filter(p => p.verificationStatus === "no").length;
    
    return {
      total,
      verified,
      matches,
      noMatches,
      pending: total - verified
    };
  }

  reset() {
    this.profiles = [];
    this.nextId = 1;
    toast.info("Session reset");
  }
}

export default new ProfileService();